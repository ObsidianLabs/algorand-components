import * as monaco from 'monaco-editor'
import { registerRulesForLanguage } from 'monaco-ace-tokenizer'
import TealHighlightRules from './TealHighlightRules'
import keywords from './keywords'

export default async function () {
  monaco.languages.register({
    id: 'teal'
  })
  registerRulesForLanguage('teal', new TealHighlightRules())

  monaco.languages.registerHoverProvider('teal', {
    provideHover: (model, position, token) => {
      const word = model.getWordAtPosition(position)
      if (!word) {
        return
      }
      const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)

      const found = keywords.find(item => item.value === word.word)
      if (!found) {
        return
      }
      
      return {
        range,
        contents: [
          { value: found.desc }
        ]
      }
    }
  })

  function createDependencyProposals(range) {
    return keywords.map(item => ({
      label: item.value,
      kind: monaco.languages.CompletionItemKind[item.kind || 'Function'],
      documentation: item.desc,
      insertText: item.insertText,
      range: range,
    }))
  }


  monaco.languages.registerCompletionItemProvider('teal', {
    provideCompletionItems(model, position) {
      var word = model.getWordUntilPosition(position)
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }
      return {
        suggestions: createDependencyProposals(range)
      }
    }
  })
}