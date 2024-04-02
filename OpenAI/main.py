import sys
import os
import openai
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QTextEdit, QLineEdit, QPushButton
from PyQt5.QtCore import QThread, pyqtSignal
from llama_index.core import StorageContext, load_index_from_storage
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get OpenAI API key from environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key is None:
    raise ValueError("No OpenAI API key found in .env file")

# Set OpenAI API key
openai.api_key = openai_api_key

class QueryThread(QThread):
    """
    A thread for performing queries asynchronously.
    """

    # Signal emitted when query is completed
    query_completed = pyqtSignal(str)

    def __init__(self, query, index):
        super().__init__()
        self.query = query
        self.index = index

    def run(self):
        # Perform query using index
        query_engine = self.index.as_query_engine()
        response = query_engine.query(self.query)

        # Process response
        if not response:
            response = "I'm sorry, I don't understand that question"
        else:
            response = str(response)  # Convert response to string
        # Emit signal with response
        self.query_completed.emit(response)

class ChatBotWindow(QMainWindow):
    """
    Main window for the chatbot application.
    """

    def __init__(self):
        super().__init__()

        self.setWindowTitle("ChatBot")
        self.setGeometry(100, 100, 400, 400)

        # Create central widget
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        # Create vertical layout
        self.layout = QVBoxLayout()
        self.central_widget.setLayout(self.layout)

        # Create text edit widget for chat log
        self.chat_log = QTextEdit()
        self.chat_log.setReadOnly(True)
        self.layout.addWidget(self.chat_log)

        # Create line edit widget for user input
        self.user_input = QLineEdit()
        self.user_input.returnPressed.connect(self.send_message)
        self.layout.addWidget(self.user_input)

        # Create button for sending messages
        self.send_button = QPushButton("Send")
        self.send_button.clicked.connect(self.send_message)
        self.layout.addWidget(self.send_button)

        # Load index from storage
        self.persist_dir = "./storage"
        storage_context = StorageContext.from_defaults(persist_dir=self.persist_dir)
        self.index = load_index_from_storage(storage_context)

    def send_message(self):
        """
        Send user input message.
        """
        user_input = self.user_input.text().strip()
        if user_input:
            # Display user input in chat log
            self.chat_log.append(f"You: {user_input}")
            self.user_input.clear()
            # Check for exit command
            if user_input.lower() == 'exit':
                sys.exit()
            else:
                # Create and start query thread
                self.query_thread = QueryThread(user_input, self.index)
                self.query_thread.query_completed.connect(self.display_response)
                self.query_thread.start()

    def display_response(self, response):
        """
        Display bot response in chat log.
        """
        self.chat_log.append(f"Bot: {response}")
        self.chat_log.append("")

if __name__ == "__main__":
    # Create QApplication instance
    app = QApplication(sys.argv)
    # Create and show ChatBotWindow instance
    window = ChatBotWindow()
    window.show()
    # Execute application event loop
    sys.exit(app.exec_())
