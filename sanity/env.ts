export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-09'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
"skVD2gQzCCGMxujekUzsNtvOBt1B8592UU48N06qddwCeGC3MoE4gJuBujdQ1GIAZfR6z6GHkn3shLDC53tufTT49Gb5W5Cfb52yDdgnb0RfcghQrv4TEPS2R9fmgYmmNCNXWAMgdrxf1OpxGRJQHoBU4WjJAAUodkPBq3NPY8JgYALMCJgy",
'Missing environment variable: NEXT_API_TOKEN'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
