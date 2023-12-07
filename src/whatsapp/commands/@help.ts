import WAWebJS from 'whatsapp-web.js'

export async function help(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  const from = message.from

  const text = `ℹ *Comandos Disponíveis* ℹ
*@help*: Listar comandos disponíveis para interação
*@ping*: _@pong_
*@_vid_ endereço-do-video*: Baixar vídeo do Youtube/X(Twitter)/Vimeo
*@pay endereço-da-noticia*: _Burlar paywall_
*@resume endereço-da-noticia*: _Resumo da matéria_
*@ac sigla-do-ativo*: _Cotação do ativo na bolsa_
*@usd*: _Cotação atual do Dólar_
*@eur*: _Cotação atual do Euro_
*@img descricao-da-imagem*: _Criar uma imagem_ (Apenas para membros premium)
*@vision url-da-imagem*: _Descreve a imagem_ (Apenas para membros premium)
*@talk*: _Marvin responde em formato de áudio_
*@reset:* _Reiniciar a conversa com bot_

OBS: Os comandos também podem ser ativados com um . no lugar no @, ex: *.pay endereço-da-noticia*
`

  return client.sendMessage(from, text)
}
