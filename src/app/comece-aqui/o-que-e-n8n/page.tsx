import type { Metadata } from "next";
import { GuideShell, H2 } from "@/components/guide-shell";
import { pageMetadata } from "@/lib/meta";

const title = "O que é n8n e como um fluxo funciona";
const description =
  "Workflows, nodes, gatilhos, credenciais e execuções do n8n, em português, e a diferença para ferramentas que cobram por passo.";

export const metadata: Metadata = pageMetadata(title, description, "/comece-aqui/o-que-e-n8n");

export default function Page() {
  return (
    <GuideShell
      title={title}
      description="Se você chegou de um post ou do Google sem nunca ter aberto o n8n, comece por aqui. O resto do guia assume estas palavras."
      related={[
        {
          href: "/t/enriquecer-empresas-cnpj-google-sheets",
          title: "Enriquecer planilha de empresas brasileiras com API de CNPJ",
          note: "Fluxo fácil e linear: planilha, consulta HTTP e escrita de volta.",
        },
        {
          href: "/t/consulta-cnpj-minha-receita-formulario",
          title: "Consultar empresa brasileira por CNPJ na Minha Receita",
          note: "Um formulário do n8n dispara a consulta, sem credencial de API.",
        },
        {
          href: "/t/agente-ia-simples-evolution-api",
          title: "Agente de IA simples no WhatsApp com Evolution API",
          note: "Gatilho de mensagem, credencial da Evolution e um passo de IA.",
        },
        {
          href: "/integracao/google-sheets",
          title: "Templates com Google Sheets",
        },
        {
          href: "/categoria/produtividade",
          title: "Categoria Produtividade",
        },
      ]}
      sources={[
        { href: "https://docs.n8n.io/choose-how-to-use-n8n/", label: "Documentação: como escolher Cloud ou self-hosted" },
        { href: "https://n8n.io/pricing/", label: "Página de preços do n8n, com a definição de execução" },
        { href: "https://docs.n8n.io/hosting/installation/docker/", label: "Documentação: instalar com Docker" },
      ]}
      faqs={[
        {
          question: "n8n é um programa que eu instalo ou um site?",
          answer:
            "Os dois existem. O n8n Cloud é o site hospedado por eles. A edição Community é o mesmo tipo de produto, instalado por você. A documentação oficial trata essa escolha como o primeiro passo.",
        },
        {
          question: "Uma execução é cada passo do fluxo?",
          answer:
            "Não. Na definição publicada na página de preços, uma execução é uma rodada inteira do workflow, do começo ao fim, independente de quantos passos existem dentro.",
        },
        {
          question: "Preciso saber programar?",
          answer:
            "Não para o primeiro fluxo. A maior parte do trabalho é ligar nodes prontos. Código entra só quando a ferramenta não tem um node para o que você quer, e a página de preços lista passos de código em JavaScript ou Python como recurso do produto.",
        },
      ]}
    >
      <p>
        O n8n é uma ferramenta de automação. Você desenha um caminho: quando acontece tal coisa, faça esta sequência e entregue o resultado em outro lugar. Quem vende no Mercado Livre, cobra no Pix ou responde WhatsApp o dia inteiro já faz esse caminho na mão. O n8n é o lugar onde esse caminho vira um fluxo que roda sozinho.
      </p>
      <p>
        Ele não é um chatbot, embora dê para colocar um agente de IA no meio do caminho. Também não é uma planilha. A planilha, o WhatsApp e o banco continuam onde estão. O n8n só visita esses sistemas, pega um dado, transforma e devolve.
      </p>
      <H2>O workflow é o fluxo inteiro</H2>
      <p>
        Workflow é o nome do fluxo. É o desenho que você vê na tela: caixinhas ligadas por setas. Um workflow tem um começo, um ou mais caminhos e um fim. Pode ser curto, tipo “chegou uma linha na planilha, consulta o CNPJ e preenche o endereço”. Pode ser longo, com ramificações, espera e mais de um sistema. No diretório, a ficha de cada template conta quantos nodes o fluxo tem, fora as notas adesivas, justamente para você ter uma noção do tamanho antes de abrir.
      </p>
      <p>
        O workflow fica salvo na sua instância. Instância é a instalação do n8n que você está usando, seja a nuvem deles, seja um servidor seu. Você pode ter vários workflows na mesma instância. A página de preços diz que os planos incluem workflows ilimitados. O que muda de plano é outra coisa, e a gente trata disso na página de preços deste guia.
      </p>
      <H2>Node é um passo</H2>
      <p>
        Cada caixinha é um node. Um node faz uma coisa só: ler uma planilha, chamar um endereço HTTP, mandar uma mensagem, decidir se o valor é maior que zero, esperar um horário. Os nodes se passam dados. A saída de um vira a entrada do próximo. Quando um template do diretório diz “8 nodes além das sticky notes”, sticky notes são os bilhetes amarelos de explicação. Eles não executam nada. Os 8 são os passos de verdade.
      </p>
      <p>
        Tem node pronto para serviços conhecidos, como Google Sheets, Gmail e Telegram. Quando o serviço não tem node, o caminho normal é o node de HTTP Request, que fala com qualquer API. É assim que entra Minha Receita, BrasilAPI, Mercado Pago, Asaas, Bling e a maior parte das ferramentas brasileiras. A página seguinte deste guia, sobre conectar as pontas, mostra esse desenho com exemplos do diretório.
      </p>
      <H2>O gatilho é o que acorda o fluxo</H2>
      <p>
        Todo workflow precisa de um começo. Esse começo é o gatilho, o trigger. Os que você vai usar na primeira semana são estes.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="text-ink">Manual.</span> Você aperta o botão de testar. Serve para ver se o fluxo está certo antes de deixar ele solto.
        </li>
        <li>
          <span className="text-ink">Agenda.</span> O Schedule Trigger acorda o fluxo num horário. Um relatório diário no WhatsApp é esse caso. A página de preços do n8n usa exatamente esse exemplo: um agendamento diário vira cerca de 30 ou 31 execuções no mês. Um agendamento a cada 5 minutos passa de 8 mil execuções no mês. Isso muda a conta, então a gente volta nisso em “Quanto custa”.
        </li>
        <li>
          <span className="text-ink">Webhook.</span> Outro sistema chama o seu n8n quando algo acontece. A Hotmart e a Kiwify avisam uma compra assim. O fluxo “Receber webhook de compra da Kiwify ou Hotmart” do diretório começa desse jeito.
        </li>
        <li>
          <span className="text-ink">Gatilho do próprio app.</span> Um node fica escutando o serviço, como uma mensagem nova no WhatsApp via Evolution API. Por baixo, quase sempre é um webhook ou uma consulta repetida. Para você, a diferença prática é: alguém empurra o evento até você, ou você vai buscar.
        </li>
      </ul>
      <H2>Credencial é a chave, separada do fluxo</H2>
      <p>
        Credencial é o cofre onde fica a senha, o token ou o login OAuth. O workflow aponta para a credencial. Ele não precisa ter a senha escrita no meio do desenho. Isso importa por dois motivos. O primeiro é segurança: você compartilha o fluxo sem entregar a chave. O segundo é troca: quando a chave da Evolution API muda, você atualiza um lugar só.
      </p>
      <p>
        A documentação de instalação com Docker descreve credencial assim: é onde fica a autenticação para falar com um app. Depois de criar a credencial, o node daquele app usa essa autenticação. Pode ser usuário e senha, chave de API ou segredo de OAuth. No fluxo de CNPJ com Minha Receita que a gente usa no fim deste guia, a consulta pública não pede credencial. O Google Sheets pede, porque a planilha é sua.
      </p>
      <H2>Execução é uma rodada inteira</H2>
      <p>
        Execução é uma corrida do workflow, do gatilho até o fim. A página de preços do n8n define assim: uma execução é uma única rodada do workflow inteiro. Não importa quantos passos existem nem quanto dado passa. Continua sendo uma execução. É o oposto de ferramentas que cobram cada passo ou cada tarefa.
      </p>
      <p>
        Guarde essa frase. Ela explica a diferença que as pessoas sentem quando vêm do Zapier ou do Make. Naqueles produtos, o hábito do mercado é contar operação: cada leitura, cada filtro e cada envio soma na fatura. O n8n, no texto oficial, diz que cobra quando o fluxo roda de ponta a ponta, e que dá para fazer numa execução coisas que em outra ferramenta virariam milhares de operações. A gente não publica aqui o preço atual do Zapier nem do Make, porque isso muda no site deles e não faz parte da conta do n8n. O que dá para afirmar, com a página de preços do n8n na mão, é o modelo deles: uma rodada completa conta como um.
      </p>
      <p>
        Dentro da sua instância, cada execução fica registrada para você olhar o que entrou e o que saiu. Se um passo quebra, a execução aparece como falha e você abre o node que falhou. Isso é o jeito de aprender. O primeiro fluxo deste guia termina com você rodando uma vez na mão e lendo essa tela, antes de ligar qualquer agenda.
      </p>
      <H2>O que o n8n não faz sozinho</H2>
      <p>
        Ele não cria a conta no Mercado Pago, não verifica a sua empresa na Meta e não emite nota se você não ligar um emissor. Ele também não escolhe onde mora. Essa escolha é Cloud ou servidor seu, e a documentação trata como a primeira decisão. Se você nunca administrou um servidor, a própria página de Docker diz que self-hosting pede conhecimento técnico e recomenda o n8n Cloud para quem não tem essa prática. A página “Onde hospedar” deste guia compara as duas portas com os provedores que a gente conferiu.
      </p>
      <p>
        Outra limite honesta: um template do diretório é um ponto de partida, não um produto instalado na sua empresa. Você importa, troca a credencial, aponta para a sua planilha e testa. O botão “Abrir template” leva à fonte original. A gente não republica o JSON.
      </p>
      <H2>Um caminho curto para sair desta página</H2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Leia “Onde hospedar” se a dúvida é Cloud ou VPS.</li>
        <li>Leia “Quanto custa” antes de prometer um fluxo que roda a cada minuto.</li>
        <li>Abra o template de enriquecimento de CNPJ e o de consulta por formulário. Os dois mostram gatilho, node e execução sem um monte de serviço pago no meio.</li>
        <li>Quando quiser ver credencial de verdade, abra o agente simples de WhatsApp com Evolution API. Ali já tem chave de API e um passo de IA.</li>
      </ol>
      <p>
        Se alguma palavra daqui ainda estiver solta, a próxima página repete o vocabulário em cima de uma decisão concreta: onde esse n8n vai morar.
      </p>
    </GuideShell>
  );
}
