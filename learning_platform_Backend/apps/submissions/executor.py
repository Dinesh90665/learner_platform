import os
import subprocess
import sys
import tempfile
import time



def run_python_code(source_code, input_data="", timeout=3):
    start_time = time.time()

    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = os.path.join(temp_dir, "main.py")

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(source_code)

        try:
            # Make sure input is a string and preserve all lines
            if input_data is None:
                input_data = ""

            input_data = str(input_data)

            # Normalize Windows line endings
            input_data = input_data.replace("\r\n", "\n")
            input_data = input_data.replace("\r", "\n")

            # Add final newline if needed
            if input_data and not input_data.endswith("\n"):
                input_data += "\n"

            print("DEBUG INPUT:", repr(input_data))

            result = subprocess.run(
                [
                    sys.executable,
                    file_path,
                ],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=temp_dir,
            )

            execution_time = time.time() - start_time

            print("DEBUG STDOUT:", repr(result.stdout))
            print("DEBUG STDERR:", repr(result.stderr))

            if result.returncode == 0:
                return {
                    "status": "completed",
                    "output": result.stdout,
                    "error": "",
                    "execution_time": execution_time,
                }

            return {
                "status": "runtime_error",
                "output": result.stdout,
                "error": result.stderr,
                "execution_time": execution_time,
            }

        except subprocess.TimeoutExpired:
            return {
                "status": "time_limit",
                "output": "",
                "error": "Execution timed out.",
                "execution_time": time.time() - start_time,
            }

        except Exception as e:
            return {
                "status": "runtime_error",
                "output": "",
                "error": str(e),
                "execution_time": time.time() - start_time,
            }
        
def run_cpp_code(source_code, input_data="", compile_timeout=10, timeout=3):
    start_time = time.time()

    with tempfile.TemporaryDirectory() as temp_dir:
        source_path = os.path.join(temp_dir, "main.cpp")
        executable_path = os.path.join(temp_dir, "main.exe")

        with open(source_path, "w", encoding="utf-8") as f:
            f.write(source_code)

        try:
            # Make sure input is a string and preserve all lines
            if input_data is None:
                input_data = ""

            input_data = str(input_data)

            # Normalize Windows line endings
            input_data = input_data.replace("\r\n", "\n")
            input_data = input_data.replace("\r", "\n")

            # Add final newline if needed
            if input_data and not input_data.endswith("\n"):
                input_data += "\n"

            print("DEBUG C++ INPUT:", repr(input_data))

            # Compile C++
            compile_result = subprocess.run(
                [
                    "g++",
                    source_path,
                    "-o",
                    executable_path,
                ],
                capture_output=True,
                text=True,
                timeout=compile_timeout,
                cwd=temp_dir,
            )

            print(
                "DEBUG C++ COMPILE STDOUT:",
                repr(compile_result.stdout)
            )

            print(
                "DEBUG C++ COMPILE STDERR:",
                repr(compile_result.stderr)
            )

            if compile_result.returncode != 0:
                return {
                    "status": "compilation_error",
                    "output": "",
                    "error": compile_result.stderr,
                    "execution_time": time.time() - start_time,
                }

            # Run C++
            result = subprocess.run(
                [
                    executable_path,
                ],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=temp_dir,
            )

            execution_time = time.time() - start_time

            print(
                "DEBUG C++ STDOUT:",
                repr(result.stdout)
            )

            print(
                "DEBUG C++ STDERR:",
                repr(result.stderr)
            )

            if result.returncode == 0:
                return {
                    "status": "completed",
                    "output": result.stdout,
                    "error": "",
                    "execution_time": execution_time,
                }

            return {
                "status": "runtime_error",
                "output": result.stdout,
                "error": result.stderr,
                "execution_time": execution_time,
            }

        except subprocess.TimeoutExpired:
            return {
                "status": "time_limit",
                "output": "",
                "error": "Execution timed out.",
                "execution_time": time.time() - start_time,
            }

        except FileNotFoundError:
            return {
                "status": "compilation_error",
                "output": "",
                "error": "g++ was not found.",
                "execution_time": time.time() - start_time,
            }

        except PermissionError as e:
            return {
                "status": "runtime_error",
                "output": "",
                "error": f"Windows permission error: {e}",
                "execution_time": time.time() - start_time,
            }

        except Exception as e:
            return {
                "status": "runtime_error",
                "output": "",
                "error": str(e),
                "execution_time": time.time() - start_time,
            }
def run_java_code(source_code, input_data="", compile_timeout=10, timeout=3):
    start_time = time.time()

    with tempfile.TemporaryDirectory() as temp_dir:
        source_path = os.path.join(temp_dir, "Main.java")

        with open(source_path, "w", encoding="utf-8") as f:
            f.write(source_code)

        try:
            # Make sure input is a string and preserve all lines
            if input_data is None:
                input_data = ""

            input_data = str(input_data)

            # Normalize Windows line endings
            input_data = input_data.replace("\r\n", "\n")
            input_data = input_data.replace("\r", "\n")

            # Add final newline if needed
            if input_data and not input_data.endswith("\n"):
                input_data += "\n"

            print("DEBUG JAVA INPUT:", repr(input_data))

            # Compile Java
            compile_result = subprocess.run(
                [
                    "javac",
                    source_path,
                ],
                capture_output=True,
                text=True,
                timeout=compile_timeout,
                cwd=temp_dir,
            )

            print(
                "DEBUG JAVA COMPILE STDOUT:",
                repr(compile_result.stdout)
            )

            print(
                "DEBUG JAVA COMPILE STDERR:",
                repr(compile_result.stderr)
            )

            if compile_result.returncode != 0:
                return {
                    "status": "compilation_error",
                    "output": "",
                    "error": compile_result.stderr,
                    "execution_time": time.time() - start_time,
                }

            # Run Java
            result = subprocess.run(
                [
                    "java",
                    "-cp",
                    temp_dir,
                    "Main",
                ],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=temp_dir,
            )

            execution_time = time.time() - start_time

            print(
                "DEBUG JAVA STDOUT:",
                repr(result.stdout)
            )

            print(
                "DEBUG JAVA STDERR:",
                repr(result.stderr)
            )

            if result.returncode == 0:
                return {
                    "status": "completed",
                    "output": result.stdout,
                    "error": "",
                    "execution_time": execution_time,
                }

            return {
                "status": "runtime_error",
                "output": result.stdout,
                "error": result.stderr,
                "execution_time": execution_time,
            }

        except subprocess.TimeoutExpired:
            return {
                "status": "time_limit",
                "output": "",
                "error": "Execution timed out.",
                "execution_time": time.time() - start_time,
            }

        except FileNotFoundError:
            return {
                "status": "compilation_error",
                "output": "",
                "error": "Java compiler/runtime was not found.",
                "execution_time": time.time() - start_time,
            }

        except PermissionError as e:
            return {
                "status": "runtime_error",
                "output": "",
                "error": f"Windows permission error: {e}",
                "execution_time": time.time() - start_time,
            }

        except Exception as e:
            return {
                "status": "runtime_error",
                "output": "",
                "error": str(e),
                "execution_time": time.time() - start_time,
            }