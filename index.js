function alterarQtd(botao, valor){
        const input = botao.parentElement.querySelector("input");
        let atual = parseInt(input.value);
        atual+= valor;
        if(atual < 0) atual = 0;
        input.value = atual;
      }
 
