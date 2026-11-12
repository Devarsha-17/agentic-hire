import unittest
from unittest.mock import patch

from agents.graph import MatchEvaluation, graph_app


class FakeEvaluator:
    def with_structured_output(self, schema, method):
        return self

    def invoke(self, messages):
        self.messages = messages
        return MatchEvaluation(
            suitability_score=76,
            reasoning="The resume demonstrates several required skills.",
            strengths=["Python"],
            missing_skills=["Kubernetes"],
        )


class MatchGraphTests(unittest.TestCase):
    def test_graph_returns_validated_assessment_for_supplied_inputs(self):
        evaluator = FakeEvaluator()
        with patch("agents.graph.get_chat_model", return_value=evaluator):
            result = graph_app.invoke(
                {
                    "candidate_text": "Resume text mentioning Python.",
                    "job_description": "Role requiring Python and Kubernetes.",
                }
            )

        self.assertEqual(result["suitability_score"], 76)
        self.assertEqual(result["strengths"], ["Python"])
        self.assertEqual(result["missing_skills"], ["Kubernetes"])
        self.assertIn("Resume text mentioning Python.", evaluator.messages[1].content)
        self.assertIn("Role requiring Python and Kubernetes.", evaluator.messages[1].content)


if __name__ == "__main__":
    unittest.main()
