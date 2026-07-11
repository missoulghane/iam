import { describe, expect, it, vi } from 'vitest'
import { fireEvent, renderWithProviders, screen } from '@/test/test-utils'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders the title and message when open', () => {
    renderWithProviders(
      <ConfirmDialog
        open
        title="Supprimer l'utilisateur"
        message="Cette action est irréversible."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByText("Supprimer l'utilisateur")).toBeInTheDocument()
    expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument()
  })

  it('does not render its content when closed', () => {
    renderWithProviders(
      <ConfirmDialog
        open={false}
        title="Supprimer l'utilisateur"
        message="Cette action est irréversible."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.queryByText("Supprimer l'utilisateur")).not.toBeInTheDocument()
  })

  it('calls onConfirm and onCancel when the respective buttons are clicked', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    renderWithProviders(
      <ConfirmDialog
        open
        title="Supprimer l'utilisateur"
        message="Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    fireEvent.click(screen.getByText('Supprimer'))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText('Annuler'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
