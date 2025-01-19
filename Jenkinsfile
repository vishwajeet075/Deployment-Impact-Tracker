pipeline {
  agent any

  stages {
    // Stage 1: Checkout code from GitHub
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
      }
    }

    // Stage 2: Build the project (if applicable)
    stage('Build') {
      steps {
        echo 'Building the project...'
        // Add build commands here (e.g., npm install, npm build)
      }
    }

    // Stage 3: Deploy the project
    stage('Deploy') {
      steps {
        echo 'Deploying the project...'
        // Add deployment commands here (e.g., scp, rsync, or AWS CLI)
      }
    }

    // Stage 4: Notify users (optional)
    stage('Notify') {
      steps {
        echo 'Sending email notifications...'
        // Add email notification logic here
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded!'
    }
    failure {
      echo 'Pipeline failed!'
    }
  }
}
