terraform {
  backend "s3" {
      encrypt   = true
      bucket = "terraform-metaadvisor"
      region = "ap-southeast-3"
      key = "terraform-metaadvisor/Production/AWS-ECS/metaadvisor-api/terraform.tfstate"
      profile = "default"
  }
}

data "aws_availability_zones" "available" {}
data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  profile = "default"
  region = "ap-southeast-3"
  name   = "dev-metaadvisor-api"

  subnet_id = ["subnet-00e5e31512317ef81", "subnet-0e7366ed85c26f5fb"]
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  tags = {
    Name       = local.name
    Organization = "metaadvisor"
    Env = "production"
    Terraform = "true"
  }
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-southeast-3"
}


resource "aws_ecs_task_definition" "metaadvisor-api_ecs_task" {
  family                   = local.name
  requires_compatibilities = ["EC2"]

  execution_role_arn = "arn:aws:iam::022499040607:role/deployer-task-execution"
  task_role_arn = "arn:aws:iam::022499040607:role/deployer-task"
  network_mode       = "awsvpc"
  skip_destroy       = true

  container_definitions = jsonencode([
    {
      name = "${var.ECS_SERVICE}",
      image = "${var.IMAGE}",
      essential = true,
      memoryReservation = 512,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
            awslogs-create-group = "true",
            awslogs-group = "metaadvisor-api",
            awslogs-region = "ap-southeast-3",
            awslogs-stream-prefix = "/${var.ECS_CLUSTER_NAME}/${var.ENVIRONMENT}"
        }
      },
      pseudoTerminal = true,
      readonlyRootFilesystem = false,
      privileged = false,
      dependsOn = [],
      portMappings = [
        {
          name  = "${var.ECS_SERVICE}"
          protocol = "tcp",
          containerPort = 3000,
          hostPort = 0
        }
      ],
      environment = [
        {
          name = "AWS_S3_REGION",
          value = "ap-southeast-3"
        },
        {
          name = "TZ",
          value = "Asia/Jakarta"
        }
      ],
      secrets = [
        {
          name = "DB_HOST",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/DB_HOST"
        },
        {
          name = "DB_NAME",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/DB_NAME"
        },
        {
          name = "DB_PORT",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/DB_PORT"
        },
        {
          name = "DB_USER",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/DB_USER"
        },
        {
          name = "DB_PASSWORD",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/DB_PASSWORD"
        },
        {
          name = "DB_DEBUG",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/DB_DEBUG"
        },
        {
          name = "PATH_ASSET",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor/PATH_ASSET"
        }
      ],
      healthCheck = {
        retries = 3
        command = ["CMD-SHELL","curl -f http://localhost:3000/ || exit 1"]
        timeout = 5
        interval = 30
        startPeriod = 15
        },
      tags = [
        {
          key = "Organization",
          value = "metaadvisor"
        },
        {
          key = "Terraform",
          value = "true"
        },
        {
          key = "Env",
          value = "Development"
        },
        {
          key = "Name",
          value = "metaadvisor-api"
        }
    ]
    }
  ])
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_ecs_service" "metaadvisor-api" {
  name            = local.name
  cluster         = "arn:aws:ecs:ap-southeast-1:022499040607:cluster/alphact-ecs-production"
  task_definition = aws_ecs_task_definition.metaadvisor-api_ecs_task.arn
  desired_count   = 1
  deployment_maximum_percent = 200
  deployment_minimum_healthy_percent = 50
  wait_for_steady_state = true

  network_configuration {
    subnets             = local.subnet_id
    assign_public_ip    = "false"
    security_groups     = ["sg-0a5ab7f62e494de17", "sg-0a310167c6241bd6a"]
  }

  capacity_provider_strategy {
    base              = 1
    capacity_provider = "metaadvisor_absence_prod"
    weight            = 100
  }

  load_balancer {
    target_group_arn = "arn:aws:elasticloadbalancing:ap-southeast-1:022499040607:targetgroup/prod-web-hade/b253e6f9777a2708"
    container_name  = local.name
    container_port  = 3000
  }

  service_connect_configuration {
    enabled = true
    namespace = "production"
    service {
      discovery_name = var.ECS_SERVICE
      port_name      = var.ECS_SERVICE
      client_alias {
        dns_name = var.ECS_SERVICE
        port     = 3000
      }
    }
  }

  ordered_placement_strategy {
    type  = "binpack"
    field = "memory"
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  tags = local.tags
}

resource "aws_appautoscaling_target" "metaadvisor-api" {
  max_capacity = 6
  min_capacity = 1
  resource_id = "service/${var.ECS_CLUSTER_NAME}/${aws_ecs_service.metaadvisor-api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace = "ecs"
}

resource "aws_appautoscaling_policy" "metaadvisor-api" {
  name               = "prod-memory-metaadvisor-api"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.metaadvisor-api.resource_id
  scalable_dimension = aws_appautoscaling_target.metaadvisor-api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.metaadvisor-api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value       = 70
    scale_in_cooldown  = 120
    scale_out_cooldown = 120
  }
}

resource "aws_appautoscaling_policy" "github_runner_cpu" {
  name = "prod-cpu-metaadvisor-api"
  policy_type = "TargetTrackingScaling"
  resource_id = aws_appautoscaling_target.metaadvisor-api.resource_id
  scalable_dimension = aws_appautoscaling_target.metaadvisor-api.scalable_dimension
  service_namespace = aws_appautoscaling_target.metaadvisor-api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 65
    scale_in_cooldown  = 120
    scale_out_cooldown = 120
  }
}

#Variables

variable "ECS_CLUSTER_NAME" {
  description = "Parameter variable for input ecs-cluster-name"
  type = string
}

variable "ECS_SERVICE" {
  description = "Parameter variable for input ecs-service"
  type = string
}

variable "IMAGE" {
  description = "Parameter variable for input image"
  type = string
}

variable "ENVIRONMENT" {
  description = "Parameter variable for input environment"
  type = string
}