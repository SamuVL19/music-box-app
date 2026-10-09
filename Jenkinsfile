pipeline {
    agent any

    tools {
        nodejs 'Node_24'
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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    /var/jenkins_home/tools/hudson.plugins.sonar.SonarRunnerInstallation/MySonarQube/bin/sonar-scanner \
                    -Dsonar.projectKey=music-box-app \
                    -Dsonar.projectName="Music Box App" \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=http://sonarqube:9000 \
                    -Dsonar.javascript.node=/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/Node_24/bin/node \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'npm run test:coverage'
            }
        }

        stage('Security Scan with Snyk') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'SNYK_API_TOKEN', variable: 'SNYK_TOKEN')]) {
                        try {
                            // 1. Instalar Snyk CLI y conversor a HTML
                            sh 'npm install -g snyk snyk-to-html'

                            // 2. Autenticación
                            sh 'snyk auth ${SNYK_TOKEN}'

                            // 3. Monitoreo continuo (opcional en panel Snyk)
                            sh 'snyk monitor --all-projects || true'

                            // 4. Test con salida JSON para reporte
                            // (se usa || true para permitir crear el reporte HTML antes de evaluar)
                            sh 'snyk test --all-projects --severity-threshold=high --json-file-output=snyk_results.json || true'

                            // 5. Generar reporte HTML a partir del JSON
                            sh 'snyk-to-html -i snyk_results.json -o snyk_report.html'

                            // 6. Publicar reporte HTML en Jenkins
                            publishHTML target: [
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: '.',
                                reportFiles: 'snyk_report.html',
                                reportName: 'Snyk Security Report'
                            ]

                            // 7. Test de validación estricta (falla si hay vulnerabilidades altas/críticas)
                            sh 'snyk test --all-projects --severity-threshold=high'

                        } catch (err) {
                            echo "Snyk scan detectó vulnerabilidades o falló: ${err}"
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
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