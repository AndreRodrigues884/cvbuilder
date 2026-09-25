import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin vem excluído do bundling por defeito no Next 16 (fica de
  // fora, carregado via require() nativo em runtime). O problema: internamente
  // ele faz require('jwks-rsa'), que por sua vez faz require('jose') — e o
  // jose é um pacote ESM puro. Esse require() nunca passa pelo bundler (fica
  // fora do alcance de serverExternalPackages/webpack), corre em Node puro em
  // runtime na Vercel, e rebenta com ERR_REQUIRE_ESM. A correção é forçar o
  // firebase-admin a ser mesmo incluído no bundle, para o jose ser resolvido
  // em build-time pelo Webpack em vez de exigir require() nativo em runtime.
  transpilePackages: ["firebase-admin"],
};

export default nextConfig;
