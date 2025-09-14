import re
from typing import Dict, List, Tuple
from .schemas import QuizCreate, QuestionCreate, OptionCreate

class QuizTextParser:
    def __init__(self):
        self.patterns = {
            'quiz_header': re.compile(r'(\w+) Quiz Generated on: (.+)\nNumber of Questions: (\d+)\nContent Source: (.+)', re.MULTILINE),
            'topic': re.compile(r'TOPIC: (.+)', re.MULTILINE),
            'explanation': re.compile(r'EXPLANATION: (.+?)(?=Question \d+|$)', re.MULTILINE | re.DOTALL),
            'question_block': re.compile(r'Question (\d+)\nPrompt: (.+?)\nA\) (.+?)\nB\) (.+?)\nC\) (.+?)\nD\) (.+?)\nAnswer: ([ABCD])\nExplanation:', re.MULTILINE | re.DOTALL),
            'explanation_content': re.compile(r'Explanation:\n\*\*\*\nTRANSLATION: (.+?)\nAI_ANSWER: (.+?)\nAI_CORRECTION: (.+?)\nEXPLANATION: (.+?)\nADDITIONAL_EXAMPLES: (.+?)\n\*\*\*', re.MULTILINE | re.DOTALL)
        }
    
    def parse_quiz_text(self, text: str) -> QuizCreate:
        """Parse the quiz text and return a QuizCreate object"""
        
        # Extract quiz header information
        header_match = self.patterns['quiz_header'].search(text)
        if not header_match:
            raise ValueError("Could not find quiz header information")
        
        language = header_match.group(1).strip()
        generated_date = header_match.group(2).strip()
        number_of_questions = int(header_match.group(3))
        content_source = header_match.group(4).strip()
        
        # Extract topic
        topic_match = self.patterns['topic'].search(text)
        if not topic_match:
            raise ValueError("Could not find topic information")
        topic = topic_match.group(1).strip()
        
        # Extract explanation
        explanation_match = self.patterns['explanation'].search(text)
        explanation = explanation_match.group(1).strip() if explanation_match else None
        
        # Create title
        title = f"{language} Quiz - {topic} ({generated_date})"
        
        # Parse questions
        questions = self._parse_questions(text)
        
        return QuizCreate(
            title=title,
            topic=topic,
            explanation=explanation,
            number_of_questions=number_of_questions,
            questions=questions
        )
    
    def _parse_questions(self, text: str) -> List[QuestionCreate]:
        """Parse all questions from the text"""
        questions = []
        
        # Split text by "Question X" to get individual question blocks
        question_blocks = re.split(r'\nQuestion (\d+)\n', text)
        
        # Remove the first element (content before first question)
        if len(question_blocks) > 1:
            question_blocks = question_blocks[1:]
        
        # Process pairs of question numbers and content
        for i in range(0, len(question_blocks), 2):
            if i + 1 < len(question_blocks):
                question_number = int(question_blocks[i])
                question_content = question_blocks[i + 1]
                
                # Parse individual question
                question = self._parse_single_question(question_number, question_content)
                if question:
                    questions.append(question)
        
        return questions
    
    def _parse_single_question(self, question_number: int, content: str) -> QuestionCreate:
        """Parse a single question from its content"""
        try:
            # Extract prompt
            prompt_match = re.search(r'Prompt: (.+?)\nA\)', content, re.DOTALL)
            if not prompt_match:
                return None
            prompt = prompt_match.group(1).strip()
            
            # Extract options
            option_matches = re.findall(r'([ABCD])\) (.+?)(?=\n[ABCD]\)|\nAnswer:)', content, re.DOTALL)
            if len(option_matches) != 4:
                return None
            
            options = [
                OptionCreate(option_letter=match[0], option_text=match[1].strip())
                for match in option_matches
            ]
            
            # Extract correct answer
            answer_match = re.search(r'Answer: ([ABCD])', content)
            if not answer_match:
                return None
            correct_answer = answer_match.group(1)
            
            # Extract explanation content
            explanation_content = self._extract_explanation_from_content(content)
            
            return QuestionCreate(
                question_number=question_number,
                prompt=prompt,
                correct_answer=correct_answer,
                explanation=explanation_content.get('explanation', ''),
                translation=explanation_content.get('translation'),
                ai_answer=explanation_content.get('ai_answer'),
                ai_correction=explanation_content.get('ai_correction'),
                additional_examples=explanation_content.get('additional_examples'),
                options=options
            )
            
        except Exception as e:
            print(f"Error parsing question {question_number}: {str(e)}")
            return None
    
    def _extract_explanation_from_content(self, content: str) -> Dict[str, str]:
        """Extract explanation content from question content"""
        explanation_match = self.patterns['explanation_content'].search(content)
        
        if explanation_match:
            return {
                'translation': explanation_match.group(1).strip(),
                'ai_answer': explanation_match.group(2).strip(),
                'ai_correction': explanation_match.group(3).strip(),
                'explanation': explanation_match.group(4).strip(),
                'additional_examples': explanation_match.group(5).strip()
            }
        
        return {}
