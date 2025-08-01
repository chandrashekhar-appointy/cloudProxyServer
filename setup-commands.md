# Setup Commands for AptProxy Cloud Build

## 1. Create Artifact Registry Repository
```bash
# Replace YOUR_PROJECT_ID with your actual project ID
gcloud artifacts repositories create aptproxy \
  --repository-format=docker \
  --location=europe-west1 \
  --project=YOUR_PROJECT_ID
```

## 2. Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## 3. Grant Cloud Build Permissions
```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant Artifact Registry permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/artifactregistry.writer
```

## 4. Test Local Build (Optional)
```bash
# Build locally to test
gcloud builds submit --config=cloudbuild.yaml .
```

## 5. Create GitHub Trigger
```bash
# This will be done through Console or CLI after GitHub connection
gcloud builds triggers create github \
  --repo-name=YOUR_REPO_NAME \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
``` 