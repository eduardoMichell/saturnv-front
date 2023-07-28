import { INSTRUCTIONS, REGISTERS } from './rv32i';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';


export const monacoConfig: NgxMonacoEditorConfig = {
    defaultOptions: { scrollBeyondLastLine: false }, 
    onMonacoLoad: () => {
      const monaco = (<any>window).monaco
      monaco.languages.register({ id: 'rv32i' })
   
      monaco.languages.setMonarchTokensProvider('rv32i', {
        instructions: INSTRUCTIONS,
  
        typeKeywords: [],
        operators: [
          "+", "-", "*", "/", "=", "==", ">", "<", ">=", "<="
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer: {
          root: [
            { include: "@comments" },
            { include: "@strings" },
            { include: "@numbers" },
            { include: "@registers" },
            { include: "@directives" },
            [/[a-z_$][\w$]*/, {
              "cases": {
                "@instructions": "instructions",
                "@default": "identifier"
              }
            }],
            [/[{}()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [/@symbols/, {
              "cases": {
                "@operators": "operator",
                "@default": ""
              }
            }],
            [/\s+/, "white"]
  
          ],
          comments: [
            [/#.*$/, "comment"]
          ],
          strings: [
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", "@string"]
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"]
          ],
          numbers: [
            [/\b\d+\b/, "number"],
            [/\b0[xX][0-9a-fA-F]+\b/, "number.hex"],
            [/\b0[bB][01]+\b/, "number.binary"]
          ],
          registers: [
            [/(\b(x([0-9]|[12][0-9]|3[01]))\b|zero|ra|sp|gp|tp|t[0-6]|\b(s([0-9]|1[0-1]))\b|a[0-7])/, 'registers']
          ],
          directives: [
            [/\.(text|data|string|word|ascii)\b/, 'directives']
          ]
        }
      }
      )
  
      monaco.editor.defineTheme('rv32i-theme', {
        base: 'vs',
        colors: ["#0000FF", "#000000", '#FF00FF', '#00CC33', '#FF0000', '#AACFCF'],
        rules: [
          { token: 'instructions', foreground: "#0000FF" },
          { token: 'identifier', foreground: "#000000" },
          { token: 'directives', foreground: "#FF00FF" },
          { token: 'string', foreground: "#00CC33" },
          { token: 'comments', foreground: "#00CC33" },
          { token: 'registers', foreground: "#FF0000" },
   
        ]
      })
  
      monaco.languages.registerCompletionItemProvider("rv32i",  {
        provideCompletionItems: function(model: any, position: any) {
          const wordUntil = model.getWordUntilPosition(position);
          const currentWord = wordUntil && wordUntil.word;
        
          
          const instructions = [...INSTRUCTIONS, ...REGISTERS];
      
          const suggestions = instructions
            .filter(instruction => instruction.startsWith(currentWord))
            .map(instruction => ({
              label: instruction,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: instruction
            }));
            console.log(suggestions)
          return {
            suggestions: suggestions
          };
        
      }}) 
  
      console.log(monaco.languages)
  
    } 
  };