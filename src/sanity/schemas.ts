// These schemas should be placed in your Sanity Studio 'schemas' folder.

export const drinkSchema = {
  name: 'drink',
  title: 'Drink Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title (Bilingual)',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'tr', title: 'Turkish', type: 'string' }
      ]
    },
    {
      name: 'client',
      title: 'Client / Brand',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' }
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'specs',
      title: 'Technical Specifications',
      type: 'object',
      fields: [
        { name: 'ph', title: 'pH Level', type: 'number' },
        { name: 'brix', title: 'Brix (°Bx)', type: 'number' },
        { name: 'ingredients', title: 'Key Ingredients', type: 'array', of: [{type: 'string'}] }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'tr', title: 'Turkish', type: 'text' }
      ]
    }
  ]
}

export const postSchema = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'tr', title: 'Turkish', type: 'string' }
      ]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' }
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'tr', title: 'Turkish', type: 'text' }
      ]
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}]
    }
  ]
}