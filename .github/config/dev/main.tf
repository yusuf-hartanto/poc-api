terraform {
  backend "s3" {
      encrypt   = true
      bucket = "terraform-metaadvisor"
      region = "ap-southeast-3"
      key = "terraform-metaadvisor/Dev/AWS-ECS/metaadvisor-api/terraform.tfstate"
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
    Env = "development"
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
      command = ["sh", "-c", "npm run db:migrate"],
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
          containerPort = 3000
        }
      ],
      environment = [
        {
          name = "AWS_REGION",
          value = "ap-southeast-3"
        },
        {
          name = "TZ",
          value = "Asia/Jakarta"
        },
        {
          name = "PORT",
          value = "3000"
        },
        {
          name = "APP",
          value = "Meta Advisor"
        },
        {
          name = "APP_ENV",
          value = "development"
        },
        {
          name = "ASSET_TYPE",
          value = "s3"
        },
        {
          name = "DB_DIALECT",
          value = "postgres"
        }
      ],
      secrets = [
        {
          name = "DB_HOST",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/DB_HOST"
        },
        {
          name = "DB_NAME",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/DB_NAME"
        },
        {
          name = "DB_PORT",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/DB_PORT"
        },
        {
          name = "DB_USER",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/DB_USER"
        },
        {
          name = "DB_PASSWORD",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/DB_PASSWORD"
        },
        {
          name = "DB_DEBUG",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/DB_DEBUG"
        },
        {
          name = "JWT_TOKEN",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/JWT_TOKEN"
        },
        {
          name = "JWT_REFRESH_TOKEN",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/JWT_REFRESH_TOKEN"
        },
        {
          name = "JWT_TOKEN_EXPIRED",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/JWT_TOKEN_EXPIRED"
        },
        {
          name = "JWT_REFRESH_TOKEN_EXPIRED",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/JWT_REFRESH_TOKEN_EXPIRED"
        },
        {
          name = "MAIL_DEBUG",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_DEBUG"
        },
        {
          name = "MAIL_SENDER",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_SENDER"
        },
        {
          name = "MAIL_SERVICE",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_SERVICE"
        },
        {
          name = "MAIL_HOST",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_HOST"
        },
        {
          name = "MAIL_USERNAME",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_USERNAME"
        },
        {
          name = "MAIL_PASSWORD",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_PASSWORD"
        },
        {
          name = "MAIL_PORT",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/MAIL_PORT"
        },
        {
          name = "TOKEN_TELEGRAM",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/TOKEN_TELEGRAM"
        },
        {
          name = "CHAT_ID_TELEGRAM",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/CHAT_ID_TELEGRAM"
        },
        {
          name = "BASE_DOMAIN",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/BASE_DOMAIN"
        },
        {
          name = "BASE_URL_FE",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/BASE_URL_FE"
        },
        {
          name = "AWS_BUCKET_NAME",
          valueFrom = "arn:aws:ssm:ap-southeast-3:022499040607:parameter/development/metaadvisor-api/AWS_BUCKET_NAME"
        }
      ],
      healthCheck = {
        retries = 3
        command = ["CMD-SHELL","curl -f http://localhost:3000/health || exit 1"]
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
    cpu_architecture        = "ARM64"
  }
}

resource "aws_ecs_service" "metaadvisor-api" {
  name            = local.name
  cluster         = "arn:aws:ecs:ap-southeast-3:022499040607:cluster/ecs-metaadvisor-dev"
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
    capacity_provider = "metaadvisor_dev"
    weight            = 100
  }

  load_balancer {
    target_group_arn = "arn:aws:elasticloadbalancing:ap-southeast-3:022499040607:targetgroup/api-metaadvisor/d4bcf72f391415fa"
    container_name  = local.name
    container_port  = 3000
  }

  service_connect_configuration {
    enabled = true
    namespace = "development"
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
  name               = "dev-memory-metaadvisor-api"
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
  name = "dev-cpu-metaadvisor-api"
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