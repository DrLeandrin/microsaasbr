import type { Metadata } from "next";
import { GuideShell, H2 } from "@/components/guide-shell";
import { pageMetadata } from "@/lib/meta";

const title = "Como o n8n conecta WhatsApp, Pix, Bling e nota";
const description =
  "Webhook, HTTP Request, API, OAuth e chave de API no n8n, com templates reais de Evolution API, Mercado Pago, Asaas, Bling, Hotmart e NF-e.";

export const metadata: Metadata = pageMetadata(title, description, "/comece-aqui/conectar-as-pontas");

export default function Page() {
  return (
    <GuideShell
      title={title}
      description="Conectar é só isto: ou alguém chama o seu n8n, ou o seu n8n chama alguém. A credencial é a chave dessa conversa. Os exemplos abaixo existem no diretório."
      related={[
        {
          href: "/t/mercado-pago-links-lembretes-planilha-gmail",
          title: "Links de cobrança do Mercado Pago e lembretes",
          note: "O fluxo cria o link, grava na planilha e escuta o webhook de pagamento.",
        },
        {
          href: "/t/mercado-pago-links-em-massa-planilha",
          title: "Links do Mercado Pago em massa",
          note: "Um Switch manda o mesmo link por Gmail, WhatsApp Cloud API ou Telegram.",
        },
        {
          href: "/t/agente-ia-simples-evolution-api",
          title: "Agente simples no WhatsApp com Evolution API",
          note: "Mensagem entra pela Evolution e a resposta sai pelo mesmo canal.",
        },
        {
          href: "/t/webhook-kiwify-hotmart-planilha-telegram",
          title: "Webhook de compra da Kiwify ou Hotmart",
          note: "A plataforma empurra a venda. O n8n não fica perguntando.",
        },
        {
          href: "/t/segunda-via-boleto-asaas-quepasa",
          title: "Segunda via de boleto Asaas no WhatsApp",
        },
        {
          href: "/t/lancar-xml-nfe-gmail-google-sheets",
          title: "Lançar XML de NF-e que chegou no Gmail",
          note: "Nota que já existe, lida do e-mail. Não é emissão via Focus NFe.",
        },
      ]}
      sources={[
        { href: "https://n8n.io/pricing/", label: "Página de preços: HTTP, webhook e credencial criptografada estão nos planos" },
        { href: "https://docs.n8n.io/hosting/installation/docker/", label: "Documentação: o que é uma credencial e por que o túnel não é produção" },
        { href: "https://docs.n8n.io/choose-how-to-use-n8n/", label: "Documentação: Cloud já nasce alcançável, self-hosted pede a sua URL" },
      ]}
      faqs={[
        {
          question: "Webhook e API são a mesma coisa?",
          answer:
            "Não. API é o contrato do serviço: os endereços e os campos. Webhook é um aviso empurrado até você quando algo acontece. HTTP Request é você chamando a API. Os dois usam HTTP. A direção muda.",
        },
        {
          question: "Onde fica a chave do Mercado Pago?",
          answer:
            "Na credencial do n8n, não escrita no meio do node. A documentação descreve a credencial como o lugar da autenticação. O workflow só aponta para ela.",
        },
        {
          question: "Tem template de emissão de nota pela Focus NFe?",
          answer:
            "No seed público deste diretório, não. O template de nota que existe lê XML de NF-e que já chegou no Gmail e lança na planilha. Emissão por Focus NFe, eNotas ou NFE.io não está entre os fluxos publicados.",
        },
      ]}
    >
      <p>
        Quase todo fluxo brasileiro que vale a pena é uma ponte. A planilha não fala com o Pix. O WhatsApp não fala com o Bling. O n8n fica no meio e traduz. Há dois sentidos nessa ponte, e aprender os dois evita a confusão mais comum de quem está começando.
      </p>
      <H2>Alguém chama você: webhook</H2>
      <p>
        Webhook é um endereço seu. O outro sistema, quando acontece o evento, faz um HTTP para esse endereço com os dados. No n8n, o node de Webhook publica esse endereço. No Cloud, o endereço já é público e com HTTPS. No seu VPS, você precisa do domínio e do certificado. Sem isso, a Hotmart não entrega a venda e o Mercado Pago não entrega o “pago”.
      </p>
      <p>
        O template “Receber webhook de compra da Kiwify ou Hotmart” é o caso limpo. A plataforma avisa a compra. O fluxo lê o evento, passa por um passo de IA e registra. Você não fica consultando a Hotmart a cada minuto. Cada aviso é uma execução. Se você estima 40 vendas num mês, são cerca de 40 execuções desse fluxo, mais o que mais estiver no mesmo workflow.
      </p>
      <p>
        O template de links do Mercado Pago com lembrete faz as duas direções. Ele cria a cobrança a partir da planilha e também trata o webhook de pagamento para tirar da fila quem já pagou. Quando for reproduzir, separe as duas ideias na cabeça: criar link é o n8n chamando o Mercado Pago. Aviso de pago é o Mercado Pago chamando o n8n.
      </p>
      <H2>Você chama alguém: HTTP Request</H2>
      <p>
        HTTP Request é o node genérico. Você informa o método (GET para ler, POST para criar), a URL e, se o serviço pede, um cabeçalho com a chave. A página de preços lista “custom API requests (HTTP, GraphQL, etc.)” como recurso incluído nos planos. É o node que liga o que não tem caixinha pronta.
      </p>
      <p>
        A Minha Receita, usada no fluxo de CNPJ do primeiro capítulo prático, é um GET sem chave. A URL leva o CNPJ e a resposta volta com situação, endereço e sócios. Isso é o melhor primeiro HTTP da vida, porque não tem credencial para errar.
      </p>
      <p>
        Mercado Pago, Asaas, Bling e a API de WhatsApp não são assim. Eles pedem autenticação. O desenho continua sendo HTTP. Muda o cadeado.
      </p>
      <H2>Chave de API e OAuth</H2>
      <p>
        Chave de API é um segredo que o serviço te entrega num painel. Você cola na credencial do n8n. Evolution API, Z-API e a maior parte das APIs de Pix funcionam assim: uma URL base mais um token. O template “Enviar mensagem no WhatsApp pela Z-API” e o “Agente de IA simples com Evolution API” são desse tipo. A Evolution é um programa que você hospeda, ou usa hospedado, e que fala com o WhatsApp. O n8n fala com a Evolution. São duas conexões, duas chaves possíveis: a da Evolution e, se o fluxo chama um modelo, a da OpenAI.
      </p>
      <p>
        OAuth é o outro cadeado. Em vez de colar uma senha, você clica, entra na conta Google ou na conta do Bling, e autoriza. O n8n guarda o token e renova. Google Sheets, Gmail e Calendar no diretório usam esse caminho. A credencial fica no cofre. A página de preços diz que o cofre de credenciais é criptografado nos planos.
      </p>
      <p>
        Não cole a chave no campo de expressão do node “só para testar”. Essa é a frase que vaza em print. Crie a credencial, selecione ela no node, teste. Se a chave girar, você troca a credencial e os fluxos que apontam para ela passam a usar a nova.
      </p>
      <H2>WhatsApp: Evolution, Z-API ou Cloud API</H2>
      <p>
        No diretório há três jeitos de chegar no WhatsApp, e eles não são intercambiáveis sem trocar credencial.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="text-ink">Evolution API.</span> Vários templates, do agente simples ao buffer com Redis. O n8n recebe a mensagem que a Evolution encaminha e devolve a resposta para ela enviar. Self-hosted aqui costuma ser a Evolution e o n8n na mesma rede, ou a Evolution com uma URL pública do n8n.
        </li>
        <li>
          <span className="text-ink">Z-API.</span> O template de envio pela Z-API e o agente de comércio com Nuvemshop usam esse provedor. É chave de API, no mesmo espírito da Evolution, com outro painel.
        </li>
        <li>
          <span className="text-ink">WhatsApp Cloud API.</span> É a API oficial. O template de links em massa do Mercado Pago tem um Switch: a coluna da planilha escolhe Gmail, WhatsApp Cloud API ou Telegram. A credencial da Cloud API é a do app na Meta, não a da Evolution.
        </li>
      </ul>
      <p>
        Para um primeiro teste, não misture os três. Escolha o canal que você já tem contratado e abra o template desse canal. Trocar Evolution por Cloud API no meio do fluxo é trocar o node e a credencial, não um campo de texto.
      </p>
      <H2>Pix e boleto: Mercado Pago, Asaas, e o que não tem no diretório</H2>
      <p>
        Pix no n8n, nos templates publicados, aparece como cobrança. O fluxo de lembretes cria a preferência ou o link no Mercado Pago, grava o link na planilha, manda o e-mail e escuta o webhook para saber quem pagou. O fluxo em massa faz o link único por linha e dispara no canal escolhido.
      </p>
      <p>
        Asaas aparece na segunda via de boleto e fatura, enviada no WhatsApp por Quepasa, com Postgres no meio. De novo: o n8n chama a API para achar a cobrança e manda a mensagem por outro node.
      </p>
      <p>
        PagBank não tem template no seed público deste diretório. O padrão, se você for ligar, é o mesmo HTTP com chave e, se eles oferecerem, um webhook de pagamento. A gente não descreve o endpoint aqui porque não há um fluxo conferido no diretório para apontar. Quando existir, ele entra como os outros, com fonte.
      </p>
      <H2>Bling, Hotmart e nota</H2>
      <p>
        Bling, no diretório, entra sobretudo ao lado de Bitrix24, MySQL ou planilha. “Criar pedido no Bling a partir do Bitrix24” é o atalho: um evento no CRM vira pedido no ERP. A credencial é a do Bling, em geral OAuth ou token do painel deles, selecionada no node. Não há, neste texto, um passo a passo de tela do Bling, porque isso muda no produto deles. O que não muda é o lugar da chave: a credencial do n8n.
      </p>
      <p>
        Hotmart e Kiwify, no template publicado, chegam por webhook. Você cola no painel da plataforma a URL que o node de Webhook do n8n te mostra. Compra nova, execução nova. O fluxo ainda avisa no Telegram e mexe em planilha, segundo a ficha.
      </p>
      <p>
        Nota fiscal, no que está publicado, é leitura. “Lançar XMLs de NF-e recebidos no Gmail” pega o XML que já chegou no e-mail e joga os campos na planilha. Não emite nota. O arquivo de lacunas do diretório registra que não apareceu JSON público chamando Focus NFe, eNotas ou NFE.io. Se você precisa emitir, o desenho é webhook de pagamento e depois HTTP para o emissor, mas esse template ainda não está na lista. Não vamos fingir que está.
      </p>
      <H2>Uma ordem que evita retrabalho</H2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Decida a direção. Eles chamam você, ou você chama eles?</li>
        <li>Se eles chamam, publique o webhook numa URL HTTPS. Cloud já resolve. VPS pede domínio. Plano que dorme, como o Free da Railway, não serve para isso.</li>
        <li>Se você chama, ache na documentação do serviço a URL e o tipo de autenticação. Crie a credencial antes de desenhar o resto.</li>
        <li>Teste com um evento só. Uma linha da planilha, uma compra de teste, um CNPJ.</li>
        <li>Abra a execução e leia o JSON que voltou. O próximo node só existe depois que você viu o formato real.</li>
      </ol>
      <p>
        O próximo capítulo faz essa ordem num fluxo que já está no diretório, com planilha e uma API pública, em cerca de quinze minutos.
      </p>
    </GuideShell>
  );
}
