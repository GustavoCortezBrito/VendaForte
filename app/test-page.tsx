export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Teste Tailwind CSS</h1>
        <p className="text-gray-600">Se você vê este texto estilizado, o Tailwind está funcionando!</p>
        <button className="mt-4 bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-300">
          Botão de Teste
        </button>
      </div>
    </div>
  )
}
