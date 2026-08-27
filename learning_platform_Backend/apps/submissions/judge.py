from .executor import (run_python_code,run_cpp_code,run_java_code,)


def normalize_output(output):
    return output.strip()


def judge_submission(source_code, language, test_cases):

    total_execution_time = 0

    for test_case in test_cases:

        if language == "python":
            result = run_python_code(
                source_code=source_code,
                input_data=test_case.input_data,
            )

        elif language == "cpp":
            result = run_cpp_code(
                source_code=source_code,
                input_data=test_case.input_data,
            )

        elif language == "java":
            result = run_java_code(
                source_code=source_code,
                 input_data=test_case.input_data,
    )

        else:
            return {
                "status": "runtime_error",
                "output": "",
                "error": f"Language '{language}' is not supported yet.",
                "execution_time": 0,
            }

        total_execution_time += result["execution_time"]

        if result["status"] == "time_limit":
            return {
                "status": "time_limit",
                "output": result["output"],
                "error": result["error"],
                "execution_time": total_execution_time,
            }

        if result["status"] == "compilation_error":
            return {
                "status": "compilation_error",
                "output": result["output"],
                "error": result["error"],
                "execution_time": total_execution_time,
            }

        if result["status"] == "runtime_error":
            return {
                "status": "runtime_error",
                "output": result["output"],
                "error": result["error"],
                "execution_time": total_execution_time,
            }

        actual = normalize_output(result["output"])
        expected = normalize_output(test_case.expected_output)

        if actual != expected:
            return {
                "status": "wrong_answer",
                "output": result["output"],
                "error": "",
                "execution_time": total_execution_time,
            }

    return {
        "status": "accepted",
        "output": "All test cases passed.",
        "error": "",
        "execution_time": total_execution_time,
    }