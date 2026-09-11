pipeline {
    agent any 
    
    stages { 
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/madurangaPrabhath/CI-CD-Pipeline.git'
                }
            }
        }
        stage('Build Docker Image') {
            steps {  
                bat 'docker build -t madura1999/node-app:%BUILD_NUMBER% .'
            }
        }
        stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'docker-pass', variable: 'docker-pass')]) {
                    bat 'docker login -u madura1999 -p ${docker-pass}'    
                }
            }
        }
        stage('Push Image') {
            steps {
                bat 'docker push madura1999/node-app:%BUILD_NUMBER%'
            }
        }
    }
    post {
        always {
            bat 'docker logout'
        }
    }
}