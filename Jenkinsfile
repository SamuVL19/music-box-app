pipeline {
    agent any

    tools {
        nodejs 'Node_24'
        sonarScanner 'MySonarQube'
    }

    environment {
        SONAR_PROJECT_KEY = 'music-box-app'
        SONAR_PROJECT_NAME = 'Music Box App'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'npm run test:coverage'
            }
        }

        stage('Pruebas Unitarias') {
            steps {
                sh 'npm test -- --watchAll=false --ci --reporters=default --reporters=jest-junit'
            }
            post {
                always {
                    junit 'junit.xml'
                    archiveArtifacts artifacts: 'junit.xml', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy Simulado') {
            steps {
                script {
                    sh 'mkdir -p prod && cp -r build/* prod/'
                    echo "Deploy simulado exitoso: artefactos copiados a carpeta prod/"
                }
            }
        }
    }

    post {
        always {
            script {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    error "Calidad no aprobada: ${qg.status}"
                }
            }
            echo "Ejecución finalizada con estado: ${currentBuild.result}"
        }
    }
}