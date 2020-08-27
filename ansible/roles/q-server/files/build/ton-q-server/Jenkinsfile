G_promoted_version = "master"
G_promoted_tag = "latest"

G_giturl = "https://github.com/tonlabs/ton-q-server.git"
G_gitcred = "TonJenSSH"
G_dockerCred = 'TonJenDockerHub'
G_container = "alanin/container:latest"
G_gqlimage_base = "tonlabs/q-server"
G_buildstatus = "NotSet"
G_MakeImage = "NotSet"
G_UnitTestImage = "NotSet"
G_IntegTestImage = "NotSet"
G_PushImage = "NotSet"
G_PushImageLatest = "NotSet"
C_PROJECT = "NotSet"
C_COMMITER = "NotSet"
C_HASH = "NotSet"
C_TEXT = "NotSet"
C_AUTHOR = "NotSet"


pipeline {
    agent none

    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '2', daysToKeepStr: '', numToKeepStr: '10')
        disableConcurrentBuilds()

    }
    stages {
		stage('build container up') {
			agent {
				docker {
					image G_container
					args '--network proxy_nw'
					reuseNode true
				}
			}
			stages {

				stage('Initialize') {
					steps {
						script {
							G_gitproject = G_giturl.substring(0,G_giturl.length()-4)
							G_gitbranch = sh (script: 'echo ${BRANCH_NAME}', returnStdout: true).trim()
							C_TEXT = sh (script: 'git show -s --format=%s ${GIT_COMMIT}',returnStdout: true).trim()
							C_AUTHOR = sh (script: 'git show -s --format=%an ${GIT_COMMIT}',returnStdout: true).trim()
							C_COMMITER = sh (script: 'git show -s --format=%cn ${GIT_COMMIT}',returnStdout: true).trim()
							C_HASH = sh (script: 'git show -s --format=%h ${GIT_COMMIT}',returnStdout: true).trim()
							C_PROJECT = G_giturl.substring(15,G_giturl.length()-4)
							C_GITURL = sh (script: 'echo ${GIT_URL}',returnStdout: true).trim()
							C_GITCOMMIT = sh (script: 'echo ${GIT_COMMIT}',returnStdout: true).trim()
							RELEASE_VERSION = sh (script: "jq -r '.version' package.json",returnStdout: true).trim()
						}
					}
				}

				stage('Build') {
					steps {
                        sshagent (credentials: [G_gitcred]) {
                            sh '''
                                mkdir -p ~/.ssh;
                                ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
                            '''
						    sh 'npm install --production'
						}
					}
					post {
						success {script{G_buildstatus = "success"}}
						failure {script{G_buildstatus = "failure"}}
					}
				}


				stage ('Stashing') {
					steps {
						script {
							stash excludes: '.git, Jenkinsfile, Dockerfile', includes: '*, dist/**, server/**, node_modules/**, __tests__/**', name: 'wholedir'
							}
					}
				}
			}
		post {
			always {script{cleanWs notFailBuild: true}}
		}

		}

		stage ('Make Image') {
			agent {
				node {label 'master'}
			}
			stages {
				stage ('Build Image') {
					steps {
						script {
							/* Compile string for docker tag */
							BRANCH_NAME_STRIPPED = "${BRANCH_NAME}".replaceAll("[^a-zA-Z0-9_.-]+","__")
							DOCKER_TAG = "${BRANCH_NAME_STRIPPED}-b${BUILD_ID}.${GIT_COMMIT}"
							sh "echo DOCKER_TAG: ${DOCKER_TAG}"

							G_gqlimage = "${G_gqlimage_base}:${DOCKER_TAG}"

							dir ('node') {
								unstash 'wholedir'
								docker.withRegistry('', "${G_dockerCred}") {
									builtImage = docker.build(
										"${G_gqlimage}",
										"--label 'git-commit=${GIT_COMMIT}' -f ../Dockerfile ."
									)
								}
							}
						}
					}
					post {
						success {script{G_MakeImage = "success"}}
						failure {script{G_MakeImage = "failure"}}
					}
				}

				stage ('Unit Tests') {
					steps {
						script {
							withCredentials ([
								string(credentialsId: 'cinet_arango_address', variable: 'Q_DATABASE_SERVER'),
								string(credentialsId: 'cinet_arango_auth', variable: 'Q_DATABASE_AUTH')
							]) {
								builtImage.inside ("""
									--entrypoint=''
									-u root
									-e 'Q_DATABASE_SERVER=${Q_DATABASE_SERVER}'
									-e 'Q_DATABASE_AUTH=${Q_DATABASE_AUTH}'
								""") {
								    sshagent (credentials: [G_gitcred]) {
                                        sh (
                                            label: 'Run unit tests',
                                            script: """
                                                mkdir -p ~/.ssh;
                                                ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
                                                cd /home/node
                                                npm install
                                                npm run test
                                                rm -drf node_modules
                                                npm i --production
                                            """
                                        )
                                    }
								}
							}

						}
					}
					post {
						success {script{G_UnitTestImage = "success"}}
						failure {script{G_UnitTestImage = "failure"}}
					}
				}

				stage ('Push Image') {
					steps {
						script {
							docker.withRegistry('', "${G_dockerCred}") {
								builtImage.push()
							}
						}
					}
					post {
						success {script{G_PushImage = "success"}}
						failure {script{G_PushImage = "failure"}}
						always {script{cleanWs notFailBuild: true}}
					}
				}

				stage ('Integration Tests') {
					steps {
						script {
							def params = [
								[
									$class: 'StringParameterValue',
									name: 'dockerimage_q_server',
									value: "${G_gqlimage}"
								],
								[
									$class: 'BooleanParameterValue',
									name: 'TEST_ONLY',
									value: true
								]
							]

							build job: "Infrastructure/startup-edition-node/master", parameters: params
						}
					}
					post {
						success {script{G_IntegTestImage = "success"}}
						failure {script{G_IntegTestImage = "failure"}}
					}
				}

				stage ('Tag as latest') {
					when {
						branch "${G_promoted_version}"
						beforeAgent true
					}
					steps {
						script {

							echo "RELEASE_VERSION: ${RELEASE_VERSION}"

							docker.withRegistry('', "${G_dockerCred}") {
								builtImage.push(RELEASE_VERSION)
								builtImage.push("${G_promoted_tag}")
							}
						}
					}
					post {
						success {script{G_PushImageLatest = "success"}}
						failure {script{G_PushImageLatest = "failure"}}
					}
				}
			}
		}
    }

    post {
        always {
            script {
				withCredentials ([ string (credentialsId: 'DiscordURL', variable: 'DiscordURL') ]) {
					currentBuild.description = C_TEXT
					string DiscordFooter = "Build duration is " + currentBuild.durationString
					DiscordTitle = "Job ${JOB_NAME} from GitHub " + C_PROJECT
					DiscordDescription = C_COMMITER + " pushed commit " + C_HASH + " by " + C_AUTHOR + " with a message '" + C_TEXT + "'" + "\n" \
					+ "Build number ${BUILD_NUMBER}" + "\n" \
					+ "Build: **" + G_buildstatus + "**" + "\n" \
					+ "Build Image: **" + G_MakeImage + "**" + "\n" \
					+ "Unit Tests: **" + G_UnitTestImage + "**" + "\n" \
					+ "Integration Tests: **" + G_IntegTestImage + "**" + "\n" \
					+ "Push Image: **" + G_PushImage + "**" + "\n" \
					+ "Tag Image As Latest: **" + G_PushImageLatest + "**"
					discordSend description: DiscordDescription, footer: DiscordFooter, link: RUN_DISPLAY_URL, successful: currentBuild.resultIsBetterOrEqualTo('SUCCESS'), title: DiscordTitle, webhookURL: DiscordURL
				}
            }
        }

    }
}
