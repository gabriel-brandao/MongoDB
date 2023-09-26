/*********************************************
 * OPL 12.9.0.0 Model
 * Author: marko
 * Creation Date: 16 de abr de 2021 at 16:40:44
 *********************************************/
tuple tuplas{
	int i;
	int j;
}

int H = ...;
int W = ...;
int qtdeNiveis = ...;
int qtdeCategorias = ...;

range K = 1..qtdeNiveis;
range R = 1..qtdeCategorias;

int Wmin[R] = ...;
int Wmax[R] = ...;

int M[r in R] = ftoi(floor(W/Wmin[r]));
{tuplas} RS = {<r,s>|r in R, s in 1..M[r]}; //Tuplas com o conjunto de categorias da inst�ncia e conjunto de m�dulos poss�veis para cada categoria

{int} Ir[R] = ...;//range com os itens de cada categoria - dados de entrada
int qtdeItens = sum(r in R)(card(Ir[r]));
range I = 1..qtdeItens;//range com todos os itens

int h[I] = ...;
int w[I] = ...;
int d[I] = ...;
int l[I] = ...;
int L[j in I] = ftoi(minl(d[j],floor(sum(r in R: j in Ir[r])(Wmax[r])/w[j])));
int v[I][K] = ...;
/*
{int} V[k in K] = {i | i in I};
{aresta} A[k in 1..qtdeNiveis-1] = {<i,j>|i in V[k], j in V[k+1]: i!=j};
*/
{tuplas} B = {<i,j>|i,j in I: i!=j};
float mi = 10000;//0.01;

dvar float+ z[RS];
dvar float+ y[K];
dvar int+ alfa[I][K][RS];
dvar int+ x[I][K][RS] in 0..1;
dvar int+ q[K][RS] in 0..1;
dvar int+ sigma[I][RS] in 0..1;
dvar int+ teta[I][K] in 0..1;
dvar int+ beta[K][B][RS] in 0..1;
dvar int+ gama[k in 1..qtdeNiveis-1][B][B][RS] in 0..1;
dvar int+ deltaI[I][K][RS] in 0..1;
dvar int+ deltaF[I][K][RS] in 0..1;
dvar int+ epsilon[K][RS] in 0..1;

dvar float+ Parcelas[1..4];

maximize
  
	Parcelas[1]+Parcelas[2]-Parcelas[3];
  
subject to {

  Parcelas[1] == sum(<r,s> in RS, k in K, j in Ir[r]) v[j][k]*alfa[j][k][<r,s>];
  Parcelas[2] == sum(k in 1..qtdeNiveis-1, rs in RS, i,p in B) gama[k][i][p][rs];
  Parcelas[3] == sum(r in R, s in 1..M[r]-1, k in K) mi*epsilon[k][<r,s>];
  Parcelas[4] == sum(k in K, ij in B, rs in RS) beta[k][ij][rs];
  
c5_1:
	forall(k in K, <r,s> in RS){
		Wmin[r]*q[k][<r,s>]<=sum(j in Ir[r])(w[j]*alfa[j][k][<r,s>]);
		sum(j in Ir[r])(w[j]*alfa[j][k][<r,s>])<=Wmax[r]*q[k][<r,s>];
	}
	
c5_2:
	forall(k in K, <r,s> in RS)
	  	sum(j in Ir[r])(w[j]*alfa[j][k][<r,s>])<=z[<r,s>];
	  	
c5_3:
	forall(k in K, <r,s> in RS, j in Ir[r]){
		l[j]*x[j][k][<r,s>]<=alfa[j][k][<r,s>];
		alfa[j][k][<r,s>]<=L[j]*x[j][k][<r,s>];	
	}
	
c5_4:
	forall(k in K, <r,s> in RS, j in Ir[r])
	  	h[j]*x[j][k][<r,s>]<=y[k];
	  	
c5_5:
	sum(<r,s> in RS) z[<r,s>] <= W;

add3:
	forall(<r,s> in RS)
		z[<r,s>]<=Wmax[r]*sum(k in K) q[k][<r,s>];


c5_6:
	sum(k in K) y[k] <= H;
	
c5_7:
	forall(r in R, j in Ir[r])
	  	sum(s in 1..M[r], k in K) x[j][k][<r,s>] >= 1;
	  	
c5_8:
	forall(r in R, j in Ir[r])
	  	sum(s in 1..M[r], k in K) alfa[j][k][<r,s>] <= d[j];

c5_9:
	forall(<r,s> in RS)
	  	z[<r,s>]<=Wmax[r];
	  	
c5_14:
	forall(<r,s> in RS, j in Ir[r])
		sum(k in K)x[j][k][<r,s>]<=qtdeNiveis*sigma[j][<r,s>];
	  
c5_15:
	forall(r in R, b in 1..M[r]-2, a in b+2..M[r], j in Ir[r])
		(a-b-1)*(sigma[j][<r,a>]+sigma[j][<r,b>]-1)<=sum(s in b+1..a-1)sigma[j][<r,s>];
	  
c5_17:
	forall(k in K, r in R, j in Ir[r])
		sum(s in 1..M[r])x[j][k][<r,s>]<=M[r]*teta[j][k];
		
c5_18:
	forall(m in 1..qtdeNiveis-2,l in m+2..qtdeNiveis, r in R, j in Ir[r])
		(l-m-1)*(teta[j][m]+teta[j][l]-1)<=sum(k in m+1..l-1)teta[j][k];

c5_20:
	forall(m in 1..qtdeNiveis-2, l in m+2..qtdeNiveis, <r,s> in RS, j in Ir[r])
		(l-m-1)*(x[j][m][<r,s>]+x[j][l][<r,s>]-1)<=sum(k in m+1..l-1)x[j][k][<r,s>];

add1:
	forall(k in K, r in R, j in Ir[r])
		sum(s in 1..M[r])x[j][k][<r,s>]>=teta[j][k];
	
add2:
	forall(<r,s> in RS, j in Ir[r])
		sum(k in K)x[j][k][<r,s>]>=sigma[j][<r,s>];

		
c5_21:
	forall(k in 1..qtdeNiveis-1, r in R, s in 1..M[r]-1, j in Ir[r])
		x[j][k][<r,s+1>]>=x[j][k][<r,s>]+x[j][k+1][<r,s+1>]-1;

c5_22:
	forall(k in K, <r,s> in RS, <j,e> in B)
		2*beta[k][<j,e>][<r,s>]<=x[j][k][<r,s>]+x[e][k][<r,s>];
	
add4:
	forall(k in K, <r,s> in RS, <j,e> in B: j<e){
		beta[k][<j,e>][<r,s>]>=x[j][k][<r,s>]+x[e][k][<r,s>]-1;
	}
add5:
	forall(k in K, <r,s> in RS, <j,e> in B: j>e){
		beta[k][<j,e>][<r,s>]==0;
	}		
	
	
c5_23:
	forall(k in 1..qtdeNiveis-1, <r,s> in RS, <i,j> in B,<p,e> in B:j<e && j!=e && i!=p){
		-gama[k][<i,j>][<p,e>][<r,s>]<=beta[k+1][<j,e>][<r,s>]-beta[k][<i,p>][<r,s>];
		beta[k+1][<j,e>][<r,s>]-beta[k][<i,p>][<r,s>]<=gama[k][<i,j>][<p,e>][<r,s>];
	}
	
c5_24:
	forall(k in 1..qtdeNiveis-1, <r,s> in RS, <i,j> in B,<p,e> in B:j>e && j!=e && i!=p){
		1-gama[k][<i,j>][<p,e>][<r,s>]<=beta[k][<e,j>][<r,s>]+beta[k][<i,p>][<r,s>];
		beta[k][<e,j>][<r,s>]+beta[k][<i,p>][<r,s>]<=gama[k][<i,j>][<p,e>][<r,s>];
	}		
/*
c1:
forall(k in 1..qtdeNiveis-1, <r,s> in RS, <i,j> in B, <p,e> in B: p!=j || i!=e)
  beta[k][p][i][<r,s>]+beta[k+1][j][e][<r,s>]-1<=gama[k][<i,j>][<p,e>][<r,s>];

c2:
forall(k in 1..qtdeNiveis-1, <r,s> in RS, <i,j> in B, <p,e> in B: p!=j || i!=e)
  beta[k][i][p][<r,s>]+beta[k+1][e][j][<r,s>]-1<=gama[k][<i,j>][<p,e>][<r,s>];
*/

c5_25:
	forall(k in K, <r,s> in RS, i,j,p in I: i<j<p)
		0<=beta[k][<i,j>][<r,s>]+beta[k][<j,p>][<r,s>]-beta[k][<i,p>][<r,s>]<=1;
		
c5_26:
	forall(k in K,  <r,s> in RS, <j,e> in B)
		beta[k][<j,e>][<r,s>]+beta[k][<e,j>][<r,s>]<=1;

c5_30:
	forall(k in K, <r,s> in RS, j in Ir[r])
	  	deltaI[j][k][<r,s>]<=x[j][k][<r,s>];
	  	
c5_31:	
	forall(k in K, <r,s> in RS, j in Ir[r])
	  	deltaF[j][k][<r,s>]<=x[j][k][<r,s>];
		
c5_32:
	forall(k in K, <r,s> in RS)
	  sum(j in Ir[r]) deltaI[j][k][<r,s>]==q[k][<r,s>];

c5_33:
	forall(k in K, <r,s> in RS)
	  sum(j in Ir[r]) deltaF[j][k][<r,s>]==q[k][<r,s>];

c5_34:
	forall(k in K, <r,s> in RS, j in Ir[r])
		deltaI[j][k][<r,s>]+sum(e in Ir[r]:e!=j)beta[k][<e,j>][<r,s>]==deltaF[j][k][<r,s>]+sum(e in Ir[r]:e!=j)beta[k][<j,e>][<r,s>];

c5_35:
	forall(k in K, r in R, s in 1..M[r]-1, j,e in Ir[r]:j!=e)
	  epsilon[k][<r,s>]>=deltaF[j][k][<r,s>]+deltaI[e][k][<r,s+1>]-1;
/*
cx:
	forall(k in K, <r,s> in RS)
		sum(<j,e> in B)(beta[k][<j,e>][<r,s>]+beta[k][<e,j>][<r,s>])<=sum(j in Ir[r]) x[j][k][<r,s>] - 1;
		//sum(<j,e> in B)beta[k][<j,e>][<r,s>]<=sum(j in Ir[r]) x[j][k][<r,s>] - 1;
*/	

//CORTES
forall(r in R, s in 1..M[r]-1, k in K)//For�a a alocar os m�dulos nas primeiras posi��es
  q[k][<r,s>]>=q[k][<r,s+1>];

forall(k in K, j in I, <r,s> in RS: j not in Ir[r])
  x[j][k][<r,s>] == 0;


}

execute{
	var ofile = new IloOplOutputFile("modelRun.txt");
	var contaModulos = 0;
	for(var m in RS){
		if(thisOplModel.z[m]>0){
			contaModulos++;			
		}	
	}
	ofile.writeln("no_modulos ",contaModulos);
	ofile.writeln();
	var aux = 1;
	for(var m in RS){
		if(thisOplModel.z[m]>0){
			ofile.writeln("modulo ",aux);
			aux++;
			ofile.writeln("categoria ",m.i);
			ofile.writeln("largura ",z[m]);
			var contaNiveis = 0;
			for(var k in K){
				contaNiveis++;			
			}
			ofile.writeln("no_niveis ",contaNiveis);
			ofile.writeln();
			var contNivel = 1;
			for(var k in K){
				ofile.writeln("nivel ",contNivel);
				contNivel++;		
				ofile.writeln("altura ",thisOplModel.y[k]);
				var tiposItens = 0;
				
				ofile.writeln("tipos_itens ",tiposItens);
				if(tiposItens>0){
					var indiceItem;
					var vetItens = new Array();
					var vetQtde = new Array();
					for(irs in IRS){
						if(thisOplModel.deltaI[k][irs]==1 && irs.r == m.r && irs.s == m.s){
							indiceItem = irs.i;
							vetItens[1] = indiceItem;
							vetQtde[1] = thisOplModel.alfa[k][irs];		
    					}						
					}
					var indiceVets = 1;
					var indiceFinal;
					for(irs in IRS){
						if(thisOplModel.deltaF[k][irs]==1 && irs.r == m.r && irs.s == m.s){
							indiceFinal = irs.i;
    					}						
					}
					var testeValidade = 1;
					var contaIter = 0;
					while(indiceItem!=indiceFinal && testeValidade == 1 && contaIter<1000){
						testeValidade = 0;
						contaIter++;				
						for(var j in Ir[m.r]){
							if(I2RS.find(indiceItem,j,m.r,m.s) != null){						
								if(thisOplModel.beta[k][I2RS.find(indiceItem,j,m.r,m.s)]==1){
									indiceVets++;
									indiceItem = j;
									vetItens[indiceVets] = j;
									vetQtde[indiceVets] = thisOplModel.alfa[k][IRS.find(j,m.r,m.s)];
									testeValidade = 1;
									break;					
								}
      						}													
						}				
					}
					if(contaIter >= 1000){
						ofile.write("Erro de ordena��o:Limite de itera��es atingido");					
					}
					if(testeValidade == 0){
						ofile.write("Erro de continuidade!");					
					}
					ofile.write("itens ");
					for(var i = 1; i<=indiceVets;i++)
						ofile.write(vetItens[i]-1," ");				
					ofile.writeln();
					ofile.write("quantidade ");
					for(var i = 1; i<=indiceVets;i++)
						ofile.write(vetQtde[i]," ");				
					ofile.writeln();
   				}
   				ofile.writeln();					
 			}			
 		}				
	}
	

	ofile.close();

}