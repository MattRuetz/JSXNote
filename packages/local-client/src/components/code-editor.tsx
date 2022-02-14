import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import "./code-editor.css";

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({onChange, initialValue}) => {

    const editorRef = useRef<any>();

    //This function is called when editor is first loaded
    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        editorRef.current = monacoEditor; //Create ref to use editor instance in other functions
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });
    
        monacoEditor.getModel()?.updateOptions({tabSize: 2});
    };

    const onFormatClick = () => {
        //get current editor txt. Format that txt. Return txt to editor
        const unformatted = editorRef.current.getModel().getValue();
        const formatted = prettier.format(unformatted, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true
        }).replace(/\n$/, '');

        editorRef.current.setValue(formatted);

    };

    return (
        <div className="editor-wrapper">
        <button
            className="button button-format is-primary is-small"
            onClick={onFormatClick}
        >
            Format
        </button>
        <MonacoEditor
            editorDidMount={onEditorDidMount}
            value={initialValue}
            theme="dark"
            language="javascript"
            height="100%"
            options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            }}
        />
        </div>
    );
}

export default CodeEditor;