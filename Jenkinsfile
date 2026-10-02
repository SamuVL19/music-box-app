pipeline {
    agent any

    tools {
        nodejs 'Node_24'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<tu-usuario>/music-box-app.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Pruebas Unitarias') {
            steps {
                // Ejecuta Jest generando salida JUnit en junit.xml
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
            echo "Ejecución finalizada con estado: ${currentBuild.result}"
        }
    }
}