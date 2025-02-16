import sys
from langdetect import detect

# accept the text from argument and detect the language
text = sys.argv[1]

language = detect(text)
print(f"{language}")
