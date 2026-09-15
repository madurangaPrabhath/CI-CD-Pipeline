def runNodeCommand(String command) {
	if (isUnix()) {
		sh command
	} else {
		bat command
	}
}

def runDockerCommand(String command) {
	if (isUnix()) {
		sh command
	} else {
		bat command
	}
}

pipeline {
	agent any

	options {
		timestamps()
		disableConcurrentBuilds()
	}

	parameters {
		booleanParam(name: 'PUSH_IMAGE', defaultValue: false, description: 'Push the built Docker image to a registry')
		string(name: 'IMAGE_REPOSITORY', defaultValue: 'ci-cd-pipeline-node-app', description: 'Registry repository name, for example username/repository')
		string(name: 'REGISTRY_URL', defaultValue: 'https://index.docker.io/v1/', description: 'Registry URL used by docker.withRegistry')
		string(name: 'REGISTRY_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins credentials ID for registry authentication')
	}

	environment {
		APP_DIR = 'node_app'
		IMAGE_NAME = ''
	}

	stages {
		stage('Checkout') {
			steps {
				checkout([
					$class: 'GitSCM',
					branches: [[name: '*/main']],
					doGenerateSubmoduleConfigurations: false,
					extensions: [],
					userRemoteConfigs: [[url: 'https://github.com/madurangaPrabhath/CI-CD-Pipeline.git']]
				])
			}
		}

		stage('Install Dependencies') {
			steps {
				dir(env.APP_DIR) {
					script {
						if (fileExists('package-lock.json')) {
							runNodeCommand('npm ci')
						} else {
							runNodeCommand('npm install')
						}
					}
				}
			}
		}

		stage('Test') {
			steps {
				dir(env.APP_DIR) {
					runNodeCommand('npm test')
				}
			}
		}

		stage('Build Docker Image') {
			when {
				expression {
					fileExists('Dockerfile')
				}
			}
			steps {
				script {
					env.IMAGE_NAME = params.IMAGE_REPOSITORY?.trim() ? params.IMAGE_REPOSITORY.trim() : 'ci-cd-pipeline-node-app'
					def imageTag = "${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
					runDockerCommand("docker build -t ${imageTag} -f Dockerfile .")
					currentBuild.description = imageTag
				}
			}
		}

		stage('Push Docker Image') {
			when {
				expression {
					return params.PUSH_IMAGE && params.REGISTRY_CREDENTIALS_ID?.trim()
				}
			}
			steps {
				script {
					def repository = params.IMAGE_REPOSITORY?.trim() ? params.IMAGE_REPOSITORY.trim() : 'ci-cd-pipeline-node-app'
					def imageTag = "${repository}:${env.BUILD_NUMBER}"
					withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID.trim(), usernameVariable: 'REGISTRY_USER', passwordVariable: 'REGISTRY_PASSWORD')]) {
						if (isUnix()) {
							sh('echo "$REGISTRY_PASSWORD" | docker login ' + params.REGISTRY_URL.trim() + ' -u "$REGISTRY_USER" --password-stdin')
						} else {
							bat "echo %REGISTRY_PASSWORD% | docker login ${params.REGISTRY_URL.trim()} -u %REGISTRY_USER% --password-stdin"
						}
						runDockerCommand("docker push ${imageTag}")
						runDockerCommand("docker tag ${imageTag} ${repository}:latest")
						runDockerCommand("docker push ${repository}:latest")
					}
				}
			}
		}
	}

	post {
		always {
			echo 'Pipeline finished.'
		}
		success {
			echo 'Build, test, and image publishing completed successfully.'
		}
		failure {
			echo 'Pipeline failed. Check the stage logs above for the first error.'
		}
	}
}
