pipeline {
    agent { docker { image 'node:20.17.0-alpine3.20'} }
    stages {
        stage('Build Docker Image') {
            steps {
               sh 'ls -la'
            }
        }
        stage('Build') {
            agent {
                docker {
                    image 'app'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
            }
        }
    }
}
