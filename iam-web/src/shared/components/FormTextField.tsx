import { useController, type Control, type FieldValues, type Path } from 'react-hook-form'
import TextField, { type TextFieldProps } from '@mui/material/TextField'

interface FormTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'error'> {
  name: Path<T>
  control: Control<T>
}

export function FormTextField<T extends FieldValues>({
  name,
  control,
  helperText,
  ...props
}: FormTextFieldProps<T>) {
  const { field, fieldState } = useController({ name, control })

  return (
    <TextField
      {...field}
      {...props}
      error={!!fieldState.error}
      helperText={fieldState.error?.message ?? helperText}
      fullWidth
    />
  )
}
