# Levantamento de requisitos PandaPower

#### Tarefas PVRV 22/11/2024

[x] Arrumar as funções de calculo de potencia para retornar os valores na função imprimir_resultados

[x] inves de criar uma coluna no net.res_trafo, colocar os calculos direto no dataframe direto

[x] Testar limites nas linhas e barramentos

[x] Somar as violações para encontrar a aptidão

[x] 1 - fazer com que a função criada possa retornar os dados (imprimir resultados) que foram colocados nos gráficos **negrito**(tensão, pot.aparente, percentual de carga) como matrizes ou vetores (pode ser um método em POO também), CHECK FOI RETORNADO EM DF

[x] 2 - incluir a possibilidade de escolha ou passagem do sistema (net) na instancia da classe

[x] 3 - Classe deve retornar matriz ou **vetor** com todas as potências aparentes dos ramos (line e trafo) e todas as magnitudes de tensões das barras (bus).

[x] 4 - Classe deve ter método que desliga ramos de linhas e trafos (line.in_service e trafo.in_service).
[x] 5 - implementar os pesos como atributos da classe que podem ser alterados após o objeto ser instanciado ou assumirem os valores default da Tese do Rainer.

#### Tarefas PVRV 05/12/2024

[x] fechar imprimir_resultados Arrumar as funções de calculo de potencia para retornar os valores na função (deve colocar tudo apenas em um dataframe e retorná-lo)

[x]  Testar limites nas linhas e barramentos
[x] implementar em um novo colab o código em Matlab passado pelo Rainer, que retorna os cenários em uma estrutura que deverá ser adequada para ser plugada à implementação anterior.

[] voltagem das barras deve ser transformado para pu e comparado com o net.bus.max_vm_pu e net.bus.min.vm_pu - se for maior que max violou, se for menor que min violou também.

[] Para colocar as tensões em pu : dividir tensão resultado do fluxo / net.bus.vn_kv

[x]  Retornar o somatório (valor + limite max ou limite min + valor) para calcular a aptidão daquele cenário de todas as violações, mas ao soma cada violação você deve multiplicar por um peso. Considerando um peso para cada grandeza : dois pesos para tensão (max e min) e outro para loading_percent das linhas.

#### Tarefas PVRV 12/12/2024

[] 1 - adequar a matriz de saída do método avalia_cenarios para chamar o método calcular_violacoes a cada linha da matriz. As informações dos ramos que precisam ser desligados (1) devem ser consideradas a partir da segunda coluna e cruzadas com a informação da matriz de desligamentos.

[] 2 - Para considerar os carregamentos, o sistema de carga média (2) é exatamente igual ao IEEE14, para carga pesada (3) você deve multiplicar todas as potências ativas e reativas (identificar os elementos das estruturas net) por 1,177 e para carga leve (1) multiplicar por 0,941.

#### Tarefas PVRN 19/12/2024

[] Sobre o 1 : ao chamar o método desligar_elementos você deve passar uma lista de índices da estrutura net.line que correspondem aos ramos que são linhas da lista de desligamentos. Você também deve passar uma lista de índices da estrutura net.trafo que correspondem aos ramos que são trafos da lista de desligamentos. Importante : os campos de e para na estrutura net.line se chamam "from_bus" e "to_bus" e os campos de e para na estrutura net.trafo se chamam "hv_bus" e "lv_bus".

[] Pedro, para o caso da identificação dos ramos das linhas e dos trafos, verificar tanto um lado como o outro. Ou seja, se o ramo for 3-6, e for trafo, verificar se (hv_bus == 3 E lv_bus==6) OU (hv_bus == 6 E lv_bus==3). Se for linha, verificar se (from_bus == 3 E to_bus==6) OU (from_bus == 6 E to_bus==3).

[] Para 2 : o ajuste de cargas deve ser feito no campo "scaling" da estrutura net.load e "scaling" da estrutura net.gen. Basta copiar o fator nestes campos antes de executar o fluxo

[] Cuidado : antes de desligar os ramos de um determinado cenário, executar um método que liga todos ramos do agendamento. Criar este método que coloca os campos "in_service" das estruturas net.trafo e  net.line em True para os ramos do agendamento.

[x] Criar um draw.io e compartilhar comigo para fazermos um fluxograma de tudo que precisa ser executado.


#### Tarefas PV 30/12/2024
[] Tirar matplotlib do codigo e conectar ao streamlit de forma interativa
[] Refatorar o codigo seguindo o fluxograma
[] Ajuste nos agendamentos corretamente fazendo a otimização do rainer
