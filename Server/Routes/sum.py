import sys

from gensim.summarization import summarize

print("hi")

input_data="Natural language processing (NLP) is a subfield of artificial intelligence that focuses on the interaction between computers and human language. The goal of NLP is to enable machines to understand, interpret, and generate human-like text. It involves the development of algorithms and models that can process and analyze large volumes of textual data, extracting meaningful information and insights. NLP has applications in various domains, including machine translation, sentiment analysis, chatbots, and information retrieval.The advancement of deep learning and transformer-based models has significantly contributed to the progress in natural language processing tasks. Models like BERT (Bidirectional Encoder Representations from Transformers) and GPT (Generative Pre-trained Transformer) have achieved state-of-the-art performance in a wide range of NLP applications. These models are pre-trained on massive text corpora, allowing them to capture intricate patterns and nuances of language. As a result, NLP practitioners can leverage these pre-trained models for various tasks, saving time and resources in the development of NLP applications."

def preprocess_text(input_text):
    return input_text

def summarize_text(input_text):
    preprocessed_text = preprocess_text(input_text)
    summary = summarize(preprocessed_text)

    return summary

if __name__ == "__main__":
    input_data_str = sys.argv[1]
    # input_data_str=input_data
    result = summarize_text(input_data_str)
    print(result)
