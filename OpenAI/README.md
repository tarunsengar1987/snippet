## Installation
To use the News Articles AI ChatBot, follow these steps:

1. Download the project files as a zip archive from the.

2. Extract the downloaded zip archive to your desired location on your local machine.

3. Navigate to the extracted project directory:

4. Create a virtual environment by executing the following command in your terminal:
```bash
python -m venv venv
```

5. Activate the virtual environment:
```bash
venv\scripts\activate
```

6. Install the required dependencies using pip:
```bash
pip install -r requirements.txt
```

7. Proceed to the *.env* file and make adjustments according to your credentials.

**Important: Run the following command(python get_data_from_api.py) before executing main.py**
8. Execute the *get_data_from_api.py* script to fetch news articles data. The fetched data will be stored in the *data folder* & will do embedding and store in *storage folder* and mongo db database:
```bash
python get_data_from_api.py
```

**ChatBot interface**
9. Run the *main.py* script after obtaining the news data.
```bash
python main.py
```

10. Interact with the chatbot by asking questions. It will provide you with responses based on the provided data.

