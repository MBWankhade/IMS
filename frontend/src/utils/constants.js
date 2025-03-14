export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
  };
  
  export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  };

  export const DEFAULT_TEMPLATE_NOTEPAD = `
  <div style="font-family: 'Inter', sans-serif; color: #eee; padding: 16px;">
    <h1 style="color: #ffcc00; border-bottom: 2px solid #ffcc00; padding-bottom: 6px; margin-bottom: 12px;">
      🚀 <b>Problem Statement</b>
    </h1>
    <p style="color: #ddd; font-size: 16px; line-height: 1.6;">
      Given an integer array <code style="background: #222; color: #0f0; padding: 4px; border-radius: 4px;">nums</code>,
      find the contiguous subarray (containing at least one number) which has the 
      largest sum and return its sum.
    </p>

    <h2 style="color: #00c8ff; margin-top: 20px;"><b>Example</b></h2>
    
    <p style="color: #ddd; font-size: 16px;"><b>📌 Input:</b></p>
    <pre style="background: #111; padding: 10px; border-radius: 6px; color: #0f0; font-size: 14px;">
      [-2,1,-3,4,-1,2,1,-5,4]
    </pre>

    <p style="color: #ddd; font-size: 16px;"><b>✅ Output:</b></p>
    <pre style="background: #111; padding: 10px; border-radius: 6px; color: #0f0; font-size: 14px;">
      6
    </pre>

    <p style="color: #ddd; font-size: 16px;"><b>💡 Explanation:</b> The subarray</p>
    <pre style="background: #222; padding: 10px; border-radius: 6px; color: #0f0; font-size: 14px;">
      [4, -1, 2, 1]
    </pre>
    <p style="color: #ddd; font-size: 16px;">
      has the largest sum of <b>6</b>.
    </p>

    <h2 style="color: #ff6f61; margin-top: 20px;"><b>🔍 Constraints</b></h2>
    <ul style="color: #ddd; font-size: 16px; line-height: 1.6;">
      <li><code>1 ≤ nums.length ≤ 10^5</code></li>
      <li><code>-10^4 ≤ nums[i] ≤ 10^4</code></li>
    </ul>

    <h2 style="color: #ffcc00; margin-top: 20px;"><b>💻 Sample Code (Kadane’s Algorithm)</b></h2>
    <pre style="background: #111; padding: 12px; border-radius: 6px; color: #0f0; font-size: 14px;">
      def maxSubArray(nums):
          max_sum = float('-inf')
          curr_sum = 0
          for num in nums:
              curr_sum = max(num, curr_sum + num)
              max_sum = max(max_sum, curr_sum)
          return max_sum
    </pre>
  </div>
`;