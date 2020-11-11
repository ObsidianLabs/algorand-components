import { NewProjectModal } from '@obsidians/workspace'

NewProjectModal.defaultProps = {
  defaultTemplate: 'dynamic_fee',
  templates: [
    {
      group: 'TEAL',
      badge: 'TEAL',
      children: [
        { id: 'empty', display: 'Empty TEAL Contract' },
        { id: 'htlc', display: 'Hash Time Lock Contract' },
      ],
    },
    {
      group: 'PyTeal',
      badge: 'PyTeal',
      children: [
        { id: 'dynamic_fee', display: 'Dynamic Fee' },
        { id: 'periodic_pay', display: 'Periodic Payment' },
        { id: 'limit_order', display: 'Limit Order' },
      ],
    },
  ]
}

export default NewProjectModal
