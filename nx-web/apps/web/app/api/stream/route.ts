"use server"

function iteratorToStream(iterator: any) {
   return new ReadableStream({
      async pull(controller) {
         const { value, done } = await iterator.next()

         if (done) {
            controller.close()
         } else {
            controller.enqueue(value)
         }
      },
   })
}

function sleep(time: number) {
   return new Promise((resolve) => {
      setTimeout(resolve, time)
   })
}

const encoder = new TextEncoder()

async function* makeIterator() {
   for (let i of Array.from({ length: 10 })) {
      yield encoder.encode(`<p>${new Date().toISOString()}</p>`)
      await sleep(1_000)
   }
}

export async function GET() {
   const iterator = makeIterator()
   const stream = iteratorToStream(iterator)

   return new Response(stream)
}