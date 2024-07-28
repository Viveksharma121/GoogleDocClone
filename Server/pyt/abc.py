import sys

from sumy.nlp.tokenizers import Tokenizer
from sumy.parsers.plaintext import PlaintextParser
from sumy.summarizers.lsa import LsaSummarizer


def summarize_text(text, num_sentences=5):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, num_sentences)
    summary_sentences = [str(sentence) for sentence in summary]
    return " ".join(summary_sentences)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No content provided")
        sys.exit(1)
    
    text = sys.argv[1]
    summary = summarize_text(text, num_sentences=3)  # Adjust the number of sentences as needed
    print(summary)
