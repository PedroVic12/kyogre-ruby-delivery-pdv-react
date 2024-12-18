### Levantamento de requisitos PandaPower

#### Parte 1

[x] 1 - fazer com que a função criada possa retornar os dados que foram colocados nos gráficos **negrito**(tensão, pot.aparente, percentual de carga) como matrizes ou vetores (pode ser um método em POO também),

[ x ] 2 - incluir a possibilidade de escolha ou passagem do sistema (net) na chamada da função.

[ x ] 3 - Classe deve retornar matriz ou **vetor** com todas as potências aparentes dos ramos (line e trafo) e todas as magnitudes de tensões das barras (bus).

[ x ] 4 - Classe deve ter método que desliga ramos (line.in_service e trafo.in_service).

#### Parte 2

[] 1) - Arrumar as funções de calculo de potencia para retornar os valores na função imprimir_resultados

[] 2) - inves de criar uma coluna no net.res_trafo, colocar os calculos direto no dataframe direto

[x] 3) - Testar limites nas linhas e barramentos
- Busca dos limites das grandezas obtidas

loading percent das linhas deve ser comparado com o net.line.max_loading_percent

loading percent dos trafos deve ser comparado com o net.trafo.max_loading_percent

[x - checar com rainer] 4) - Transfomar a tensão em pu
- voltagem das barras deve ser transformado para pu e comparado com o net.bus.max_vm_pu e net.bus.min.vm_pu - se for maior que max violou, se for menor que min violou também.
- Para colocar as tensões em pu : dividir tensão resultado do fluxo / net.bus.vn_kv

[x] 5) - Somar as violações para encontrar a aptidão
- Somar (valor + limite max ou limite min + valor) para calcular a aptidão daquele cenário.

[x] **OBJETIVO para 28/11** Retornar o somatório de todas as violações, mas ao soma cada violação você deve multiplicar por um peso. Considerando um peso para cada grandeza : dois pesos para tensão (max e min) e outro para loading_percent das linhas.


#### Parte 3

[] 1 - adequar a matriz de saída do método avalia_cenarios para chamar o método calcular_violacoes a cada linha da matriz. As informações dos ramos que precisam ser desligados (1) devem ser consideradas a partir da segunda coluna e cruzadas com a informação da matriz de desligamentos.

[] 2 - Para considerar os carregamentos, o sistema de carga média (2) é exatamente igual ao IEEE14, para carga pesada (3) você deve multiplicar todas as potências ativas e reativas (identificar os elementos das estruturas net) por 1,177 e para carga leve (1) multiplicar por 0,941.