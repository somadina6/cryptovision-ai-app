pipeline {
    agent { docker { image 'node:20.17.0-alpine3.20'} }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        
    }
}