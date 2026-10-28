import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Wymuszenie odświeżenia głównych stron bloga we wszystkich językach
    revalidatePath('/pl/blog', 'page')
    revalidatePath('/en/blog', 'page')
    revalidatePath('/es/blog', 'page')
    revalidatePath('/blog', 'page')

    return NextResponse.json({ 
      revalidated: true, 
      message: 'Blog cache fully revalidated',
      dateChecked: new Date().toISOString() 
    })
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: 'Error revalidating' }, { status: 500 })
  }
}