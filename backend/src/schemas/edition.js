import z from 'zod'

const editionSchema = z.object({
  name: z.string({
    invalid_type_error: 'Edition name must be a string',
    required_error: 'Edition title is required.'
  }),
  logo: z.string(),
  year: z.number().int().min(1900),
  shortDescription: z.string(),
  longDescription: z.string(),
  catalogLink: z.string(),
  isVisible: z.boolean()
})

export function validateEdition (input) {
  return editionSchema.safeParse(input)
}

export function validatePartialEdition (input) {
  return editionSchema.partial().safeParse(input)
}
