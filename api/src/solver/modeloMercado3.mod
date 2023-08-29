/*********************************************
 * OPL 12.9.0.0 Model
 * Author: marko
 * Creation Date: 10 de jun de 2021 at 17:42:04
 *********************************************/
tuple tuplas{
	int r;
	int s;
}

tuple tripla{
	int i;
	int r;
	int s;
}

tuple quadra{
	int i;
	int j;
	int r;
	int s;
}

tuple cruzAresta{
	int i;
	int j;
	int p;
	int e;
	int r;
	int s;
}

int H = ...;
int W = ...;
int qtdeNiveis = ...;
int qtdeCategorias = ...;

range K = 1..qtdeNiveis;
range Kgama = 1..qtdeNiveis-1;
range R = 1..qtdeCategorias;

int Wmin[R] = ...;
int Wmax[R] = ...;

//int M[R] = [2,1,3];
//int M[r in R] = ftoi(floor(W/Wmin[r]));//Modulos de cada categoria
{int} Ir[R] = ...;//range com os itens de cada categoria - dados de entrada
int qtdeItens = sum(r in R)(card(Ir[r]));
range I = 1..qtdeItens;//range com todos os itens
int h[I] = ...;
int w[I] = ...;
int d[I] = ...;
int M[r in R] = ftoi(ceil(sum(i in Ir[r])(h[i]*w[i]*d[i])/(Wmin[r]*H))); 
{tuplas} RS = {<r,s>|r in R, s in 1..M[r]}; //Tuplas com o conjunto de categorias da instância e conjunto de módulos possíveis para cada categoria

{tripla} IRS = {<i,r,s>|r in R, s in 1..M[r], i in Ir[r]}; //Tuplas com o conjunto de categorias da instância e conjunto de módulos possíveis para cada categoria

int dMin[I] = ...;
int l[I] = ...;
int L[j in I] = ftoi(minl(d[j],floor(sum(r in R: j in Ir[r])(Wmax[r])/w[j])));
int v[I][K] = ...;
/*
{int} V[k in K] = {i | i in I};
{aresta} A[k in 1..qtdeNiveis-1] = {<i,j>|i in V[k], j in V[k+1]: i!=j};
*/
{quadra} I2RS = {<i,j,r,s>|r in R, s in 1..M[r], i,j in Ir[r]: i!=j}; //Tuplas com o conjunto de categorias da instância e conjunto de módulos possíveis para cada categoria
{cruzAresta} Ak = {<i,j,p,e,r,s>|r in R, s in 1..M[r], i,j,p,e in Ir[r] : i!=p && j!=e}; //Tuplas com o conjunto de categorias da instância e conjunto de módulos possíveis para cada categoria

//{tuplas} B = {<i,j>|i,j in I: i!=j};
float mi = 10000;//0.01;
float meanV[i in I] = sum(k in K)v[i][k]/qtdeNiveis;

dvar float+ z[RS];
dvar float+ y[K];
//INT
dvar int+ alfa[K][IRS];
dvar int+ x[K][IRS] in 0..1;
dvar int+ q[K][RS] in 0..1;
dvar int+ sigma[IRS] in 0..1;
dvar int+ teta[I][K] in 0..1;
dvar int+ beta[K][I2RS] in 0..1;
dvar int+ gama[k in Kgama][Ak] in 0..1;
dvar int+ deltaI[K][IRS] in 0..1;
dvar int+ deltaF[K][IRS] in 0..1;
//dvar int+ epsilon[K][RS] in 0..1;

dvar int+ minX[K][IRS] in 0..1;

dvar int+ maxAlpha[I];
dvar int+ minAlpha[I];

dvar float Parcelas[1..4];

dvar int+ u[K][IRS];//Sequência para eliminação de subciclos - MTZ

maximize
    
	Parcelas[1]-Parcelas[2]-Parcelas[3]+10*Parcelas[4];

  
subject to {

  Parcelas[1] == sum(<j,r,s> in IRS, k in K) v[j][k]*alfa[k][<j,r,s>];
  Parcelas[2] == mi*sum(k in 1..qtdeNiveis-1, a in Ak) gama[k][a];
  //Parcelas[3] == 5*sum(j in I) maxAlpha[j];//sum(r in R, s in 1..M[r]-1, k in K) mi*epsilon[k][<r,s>];
  Parcelas[3] == 10*sum(j in I)meanV[j]*(maxAlpha[j]-minAlpha[j]);
  Parcelas[4] == 0;//sum(k in K, <i,j,r,s> in I2RS) beta[k][<i,j,r,s>];

  Parcelas[2] == 0;

c5_1://Alterado
	forall(<r,s> in RS){
//		Wmin[r]<=z[<r,s>]<=Wmax[r];
		Wmin[r]*max(k in K) q[k][<r,s>]<=z[<r,s>];
		z[<r,s>]<=Wmax[r]*max(k in K) q[k][<r,s>];
	}
add_novo://Alterado
	forall(k in K, <j,r,s> in IRS){
		x[k][<j,r,s>]<=q[k][<r,s>];	
	}
	
c5_2:
	forall(k in K, <r,s> in RS)
	  	sum(j in Ir[r])(w[j]*alfa[k][<j,r,s>])<=z[<r,s>];
	  	
c5_3:
	forall(k in K, <j,r,s> in IRS){
		l[j]*x[k][<j,r,s>]<=alfa[k][<j,r,s>];
		alfa[k][<j,r,s>]<=L[j]*x[k][<j,r,s>];	
	}
	
c5_4:
	forall(k in K, <j,r,s> in IRS)
	  	h[j]*x[k][<j,r,s>]<=y[k];
	  	
c5_5:
	sum(<r,s> in RS) z[<r,s>] <= W;

add3:
	forall(<r,s> in RS)
		z[<r,s>]<=Wmax[r]*max(k in K) q[k][<r,s>];

c5_6:
	sum(k in K) y[k] <= H;
	
c5_7:
	forall(r in R, j in Ir[r])
	  	sum(s in 1..M[r], k in K) x[k][<j,r,s>] >= 1;
	  	
c5_8:
	forall(r in R, j in Ir[r])
	  	dMin[j] <= sum(s in 1..M[r], k in K) alfa[k][<j,r,s>] <= d[j];

c5_9:
	forall(<r,s> in RS)
	  	z[<r,s>]<=Wmax[r];
/*
add4://Continuidade vertical mais de dois níveis
	forall(k in K, <j,r,s> in IRS, m in 1..k-1, l in k+1..qtdeNiveis)
		x[m][<j,r,s>]+x[l][<j,r,s>]-1<=x[k][<j,r,s>];

add5://Continuidade horizontal mais de dois módulos
	forall(k in K, <j,r,s> in IRS, m in 1..s-1, l in s+1..M[r])
		x[k][<j,r,m>]+x[k][<j,r,l>]-1<=x[k][<j,r,s>];
		
add6://Combina nível e módulo
	forall(k in K, <j,r,s> in IRS, m in 1..k-1, l in k+1..qtdeNiveis, t in 1..s-1, u in s+1..M[r])
		x[m][<j,r,t>]+x[l][<j,r,u>]-1<=x[k][<j,r,s>];

add7://Combina nível e módulo
	forall(k in K, <j,r,s> in IRS, m in 1..k-1, l in k+1..qtdeNiveis, t in 1..s-1, u in s+1..M[r])
		x[l][<j,r,t>]+x[m][<j,r,u>]-1<=x[k][<j,r,s>];
*/
		
//* descomentar azeite 	
c5_14:
	forall(<j,r,s> in IRS)
		sum(k in K)x[k][<j,r,s>]<=qtdeNiveis*sigma[<j,r,s>];
	  
c5_15://c18
	forall(r in R, b in 1..M[r]-2, a in b+2..M[r], j in Ir[r])
		(a-b-1)*(sigma[<j,r,a>]+sigma[<j,r,b>]-1)<=sum(s in b+1..a-1)sigma[<j,r,s>];
	  
c5_17://c15
	forall(k in K, r in R, j in Ir[r])
		sum(s in 1..M[r])x[k][<j,r,s>]<=M[r]*teta[j][k];
		
cadd_q://Teste para evitar cruzamento com saltos de nível e/ou módulo
	forall(k in K, <j,r,s> in IRS)
	  	teta[j][k]+sigma[<j,r,s>] <= x[k][<j,r,s>]+1;	
		
		
c5_18://c17
	forall(m in 1..qtdeNiveis-2,l in m+2..qtdeNiveis, r in R, j in Ir[r])
		(l-m-1)*(teta[j][m]+teta[j][l]-1)<=sum(k in m+1..l-1)teta[j][k];

c5_20://c16
	forall(m in 1..qtdeNiveis-2, l in m+2..qtdeNiveis, <r,s> in RS, j in Ir[r])
		(l-m-1)*(x[m][<j,r,s>]+x[l][<j,r,s>]-1)<=sum(k in m+1..l-1)x[k][<j,r,s>];

c5_20_a://c16 para módulos
	forall(k in K, r in R, s1 in 1..M[r]-2, s2 in s1+2..M[r], j in Ir[r])
		(s2-s1-1)*(x[k][<j,r,s1>]+x[k][<j,r,s2>]-1)<=sum(s in s1+1..s2-1)x[k][<j,r,s>];

add1://c19
	forall(k in K, r in R, j in Ir[r])
		sum(s in 1..M[r])x[k][<j,r,s>]>=teta[j][k];
	
add2://c20
	forall(<r,s> in RS, j in Ir[r])
		sum(k in K)x[k][<j,r,s>]>=sigma[<j,r,s>];

c5_21://c21
	forall(k in 1..qtdeNiveis-1, r in R, s in 1..M[r]-1, j in Ir[r])
		x[k][<j,r,s+1>]>=1-1000*(2-x[k][<j,r,s>]-x[k+1][<j,r,s+1>]);

c5_21b://c22
	forall(k in 1..qtdeNiveis-1, r in R, s in 1..M[r]-1, j in Ir[r])
		x[k][<j,r,s>]>=1-1000*(2-x[k][<j,r,s+1>]-x[k+1][<j,r,s>]);

c5_22://c25
	forall(k in K, <j,e,r,s> in I2RS)
		2*beta[k][<j,e,r,s>]<=x[k][<j,r,s>]+x[k][<e,r,s>];
/*
addnew://c26
	forall(k in K, <j,e,r,s> in I2RS){
		beta[k][<j,e,r,s>]+beta[k][<e,j,r,s>]>=x[k][<j,r,s>]+x[k][<e,r,s>]-1;
	}
*/
/*	
add4:
	forall(k in K, <j,e,r,s> in I2RS: j<e){
		beta[k][<j,e,r,s>]>=x[k][<j,r,s>]+x[k][<e,r,s>]-1;
	}
	
add5:
	forall(k in K, <j,e,r,s> in I2RS: j>e){
		beta[k][<e,j,r,s>]>=x[k][<j,r,s>]+x[k][<e,r,s>]-1;
	}		
*/
/*
c5_23://c27
	forall(k in 1..qtdeNiveis-1, <i,j,p,e,r,s> in Ak: j<e && i!=p){
		-gama[k][<i,j,p,e,r,s>]<=beta[k+1][<j,e,r,s>]-beta[k][<i,p,r,s>];
		beta[k+1][<j,e,r,s>]-beta[k][<i,p,r,s>]<=gama[k][<i,j,p,e,r,s>];
	}
	
c5_24://c28
	forall(k in 1..qtdeNiveis-1, <i,j,p,e,r,s> in Ak: j>e && i!=p){
		1-gama[k][<i,j,p,e,r,s>]<=beta[k][<e,j,r,s>]+beta[k][<i,p,r,s>];
		beta[k][<e,j,r,s>]+beta[k][<i,p,r,s>]<=gama[k][<i,j,p,e,r,s>];
	}	
*/
//* descomentar azeite

c1://alt c27
forall(k in 1..qtdeNiveis-1, <i,j,p,e,r,s> in Ak: p==e || i==j)
  beta[k][<p,i,r,s>]+beta[k+1][<j,e,r,s>]-1<=gama[k][<i,j,p,e,r,s>];

c2://alt c28
forall(k in 1..qtdeNiveis-1, <i,j,p,e,r,s> in Ak: p==e || i==j)
  beta[k][<i,p,r,s>]+beta[k+1][<e,j,r,s>]-1<=gama[k][<i,j,p,e,r,s>];
/*
c5_25://c29 - rever se não poderia limitar para >=3 itens
	forall(k in K, <r,s> in RS, i,j,p in Ir[r]: i<j<p)
		0<=beta[k][<i,j,r,s>]+beta[k][<j,p,r,s>]-beta[k][<i,p,r,s>]<=1;
*/		
c5_26://c30
	forall(k in K,  <j,e,r,s> in I2RS)
		beta[k][<j,e,r,s>]+beta[k][<e,j,r,s>]<=1;

c5_30://c34
	forall(k in K, <j,r,s> in IRS)
	  	deltaI[k][<j,r,s>]<=x[k][<j,r,s>];
	  	
c5_31:	//c35
	forall(k in K, <j,r,s> in IRS)
	  	deltaF[k][<j,r,s>]<=x[k][<j,r,s>];
		
c5_32://c36
	forall(k in K, <r,s> in RS)
	  sum(j in Ir[r]) deltaI[k][<j,r,s>]==q[k][<r,s>];

c5_33://c37
	forall(k in K, <r,s> in RS)
	  sum(j in Ir[r]) deltaF[k][<j,r,s>]==q[k][<r,s>];

c5_34://c38
	forall(k in K, <j,r,s> in IRS)
		deltaI[k][<j,r,s>]+sum(e in Ir[r]:e!=j)beta[k][<e,j,r,s>]==deltaF[k][<j,r,s>]+sum(e in Ir[r]:e!=j)beta[k][<j,e,r,s>];
//* teste
/* Restrição comentada teste 18/10
c5_35://c39
	forall(k in K, r in R, s in 1..M[r]-1, j,e in Ir[r]:j!=e)
	  epsilon[k][<r,s>]>=deltaF[k][<j,r,s>]+deltaI[k][<e,r,s+1>]-1;
*/
cteste://Teste cruzamento sequencia horizontal
	forall(k in K, r in R, s in 1..M[r]-1,j in Ir[r])
	  sum(e in Ir[r]:e!=j) beta[k][<e,j,r,s+1>]<= 1-deltaF[k][<j,r,s>];

cteste2://Teste2 cruzamento sequencia horizontal
	forall(k in K, r in R, s in 1..M[r]-1, j in Ir[r]){
		x[k][<j,r,s>]+x[k][<j,r,s+1>]<=minX[k][<j,r,s>]+1;
		x[k][<j,r,s>]>=minX[k][<j,r,s>];
		x[k][<j,r,s+1>]>=minX[k][<j,r,s>];
		deltaI[k][<j,r,s+1>]>=minX[k][<j,r,s>];
		deltaF[k][<j,r,s>]>=minX[k][<j,r,s>];
}

/*
c5_35b://alt c39 - pensar errada
	forall(k in K, r in R, s in 1..M[r]-1, j,e in Ir[r]:j!=e)
	  epsilon[k][<r,s>]>=deltaF[k][<j,r,s>]+deltaI[k][<e,r,s+1>]+x[k][<e,r,s>]-1;
*/	  
//* teste SOLUÇÃO OLEOGINOSAS
cx:
	forall(k in K, <r,s> in RS)
		sum(j,e in Ir[r]: j!=e)beta[k][<e,j,r,s>]==sum(j in Ir[r]) x[k][<j,r,s>] - q[k][<r,s>];
		//sum(j,e in Ir[r]: j!=e)(beta[k][<j,e,r,s>]+beta[k][<e,j,r,s>])==sum(j in Ir[r]) x[k][<j,r,s>] - 1;
		//sum(<j,e> in B)beta[k][<j,e>][<r,s>]<=sum(j in Ir[r]) x[j][k][<r,s>] - 1;
/*/

//CORTES
/*
	forall(k in K, r in R, j,e in Ir[r]: j!=e)
		sum(<rl,s> in RS: rl==r) (beta[k][<j,e,r,s>]+beta[k][<e,j,r,s>])<=1;
*/

forall(r in R, s in 1..M[r]-1, k in K)//Força a alocar os módulos nas primeiras posições
  q[k][<r,s>]>=q[k][<r,s+1>];


//Restrição de eliminação de subsiclos MTZ
forall(k in K, r in R, s in 1..M[r], e,j in Ir[r]:e!=j){
	u[k][<e,r,s>]+1<=u[k][<j,r,s>]+card(Ir[r])*(1-beta[k][<e,j,r,s>]);
}


//Restrições para limitar o tamanho das frentes de itens (considerando todos os módulos)
forall(k in K, r in R, j in Ir[r]){
	sum(s in 1..M[r]) alfa[k][<j,r,s>] <= maxAlpha[j];
	sum(s in 1..M[r]) alfa[k][<j,r,s>] +10*(1-teta[j][k]) >= minAlpha[j];
}	

/*
//Restrições para limitar o número de níveis para cada item
forall(r in R, s in 1..M[r], j in Ir[r])
  sum(k in K) x[k][<j,r,s>] <=3;
*/

/*
forall(r in R, s in 3..M[r])
  z[<r,s>] == 0;
*/
  
/*  
forall(i in I)
  sum(k in K) teta[i][k]<=2;  
*/  
/*  
alfa[1][<1,1,1>] == 5;  
alfa[1][<2,1,1>] == 4;
alfa[2][<2,1,1>] == 4;
alfa[2][<3,1,1>] == 3;
alfa[3][<4,1,1>] == 2;
alfa[3][<5,1,1>] == 3;
alfa[4][<6,1,1>] == 3;
alfa[4][<7,1,1>] == 4;
alfa[5][<7,1,1>] == 6;
alfa[6][<8,1,1>] == 4;
alfa[7][<9,1,1>] == 5;
alfa[7][<10,1,1>] == 3;
*/
/* Categoria 1
x[1][<1,1,1>] == 1;
x[1][<2,1,1>] == 0;
x[1][<3,1,1>] == 0;
x[1][<4,1,1>] == 0;
x[1][<5,1,1>] == 0;
x[1][<6,1,1>] == 0;
x[1][<7,1,1>] == 0;
x[1][<8,1,1>] == 0;
x[1][<9,1,1>] == 0;
x[1][<10,1,1>] == 0;
x[1][<11,1,1>] == 0;
x[1][<12,1,1>] == 0;
x[1][<13,1,1>] == 0;
x[1][<14,1,1>] == 0;
x[1][<15,1,1>] == 0;
x[1][<16,1,1>] == 0;
x[1][<17,1,1>] == 0;
x[1][<18,1,1>] == 0;
x[1][<19,1,1>] == 0;
x[2][<1,1,1>] == 0;
x[2][<2,1,1>] == 1;
x[2][<3,1,1>] == 0;
x[2][<4,1,1>] == 0;
x[2][<5,1,1>] == 0;
x[2][<6,1,1>] == 0;
x[2][<7,1,1>] == 0;
x[2][<8,1,1>] == 0;
x[2][<9,1,1>] == 0;
x[2][<10,1,1>] == 0;
x[2][<11,1,1>] == 0;
x[2][<12,1,1>] == 0;
x[2][<13,1,1>] == 0;
x[2][<14,1,1>] == 0;
x[2][<15,1,1>] == 0;
x[2][<16,1,1>] == 0;
x[2][<17,1,1>] == 0;
x[2][<18,1,1>] == 0;
x[2][<19,1,1>] == 0;
x[3][<1,1,1>] == 0;
x[3][<2,1,1>] == 0;
x[3][<3,1,1>] == 1;
x[3][<4,1,1>] == 0;
x[3][<5,1,1>] == 0;
x[3][<6,1,1>] == 0;
x[3][<7,1,1>] == 0;
x[3][<8,1,1>] == 0;
x[3][<9,1,1>] == 0;
x[3][<10,1,1>] == 0;
x[3][<11,1,1>] == 0;
x[3][<12,1,1>] == 0;
x[3][<13,1,1>] == 0;
x[3][<14,1,1>] == 0;
x[3][<15,1,1>] == 0;
x[3][<16,1,1>] == 0;
x[3][<17,1,1>] == 0;
x[3][<18,1,1>] == 0;
x[3][<19,1,1>] == 0;
x[4][<1,1,1>] == 0;
x[4][<2,1,1>] == 0;
x[4][<3,1,1>] == 0;
x[4][<4,1,1>] == 1;
x[4][<5,1,1>] == 0;
x[4][<6,1,1>] == 0;
x[4][<7,1,1>] == 0;
x[4][<8,1,1>] == 0;
x[4][<9,1,1>] == 0;
x[4][<10,1,1>] == 0;
x[4][<11,1,1>] == 0;
x[4][<12,1,1>] == 0;
x[4][<13,1,1>] == 0;
x[4][<14,1,1>] == 0;
x[4][<15,1,1>] == 0;
x[4][<16,1,1>] == 0;
x[4][<17,1,1>] == 0;
x[4][<18,1,1>] == 0;
x[4][<19,1,1>] == 0;
x[5][<1,1,1>] == 0;
x[5][<2,1,1>] == 0;
x[5][<3,1,1>] == 0;
x[5][<4,1,1>] == 0;
x[5][<5,1,1>] == 1;
x[5][<6,1,1>] == 0;
x[5][<7,1,1>] == 0;
x[5][<8,1,1>] == 0;
x[5][<9,1,1>] == 0;
x[5][<10,1,1>] == 0;
x[5][<11,1,1>] == 0;
x[5][<12,1,1>] == 0;
x[5][<13,1,1>] == 0;
x[5][<14,1,1>] == 0;
x[5][<15,1,1>] == 0;
x[5][<16,1,1>] == 0;
x[5][<17,1,1>] == 0;
x[5][<18,1,1>] == 0;
x[5][<19,1,1>] == 0;
x[6][<1,1,1>] == 0;
x[6][<2,1,1>] == 0;
x[6][<3,1,1>] == 0;
x[6][<4,1,1>] == 0;
x[6][<5,1,1>] == 0;
x[6][<6,1,1>] == 1;
x[6][<7,1,1>] == 0;
x[6][<8,1,1>] == 0;
x[6][<9,1,1>] == 0;
x[6][<10,1,1>] == 0;
x[6][<11,1,1>] == 0;
x[6][<12,1,1>] == 0;
x[6][<13,1,1>] == 0;
x[6][<14,1,1>] == 0;
x[6][<15,1,1>] == 0;
x[6][<16,1,1>] == 0;
x[6][<17,1,1>] == 0;
x[6][<18,1,1>] == 0;
x[6][<19,1,1>] == 0;
x[7][<1,1,1>] == 0;
x[7][<2,1,1>] == 0;
x[7][<3,1,1>] == 0;
x[7][<4,1,1>] == 0;
x[7][<5,1,1>] == 0;
x[7][<6,1,1>] == 0;
x[7][<7,1,1>] == 1;
x[7][<8,1,1>] == 0;
x[7][<9,1,1>] == 0;
x[7][<10,1,1>] == 0;
x[7][<11,1,1>] == 0;
x[7][<12,1,1>] == 0;
x[7][<13,1,1>] == 0;
x[7][<14,1,1>] == 0;
x[7][<15,1,1>] == 0;
x[7][<16,1,1>] == 0;
x[7][<17,1,1>] == 0;
x[7][<18,1,1>] == 0;
x[7][<19,1,1>] == 0;
/*
x[1][<1,1,2>] == 0;
x[1][<2,1,2>] == 0;
x[1][<3,1,2>] == 0;
x[1][<4,1,2>] == 0;
x[1][<5,1,2>] == 0;
x[1][<6,1,2>] == 0;
x[1][<7,1,2>] == 0;
x[1][<8,1,2>] == 1;
x[1][<9,1,2>] == 0;
x[1][<10,1,2>] == 0;
x[1][<11,1,2>] == 0;
x[1][<12,1,2>] == 0;
x[1][<13,1,2>] == 0;
x[1][<14,1,2>] == 0;
x[1][<15,1,2>] == 0;
x[1][<16,1,2>] == 0;
x[1][<17,1,2>] == 0;
x[1][<18,1,2>] == 0;
x[1][<19,1,2>] == 0;
x[2][<1,1,2>] == 0;
x[2][<2,1,2>] == 0;
x[2][<3,1,2>] == 0;
x[2][<4,1,2>] == 0;
x[2][<5,1,2>] == 0;
x[2][<6,1,2>] == 0;
x[2][<7,1,2>] == 0;
x[2][<8,1,2>] == 0;
x[2][<9,1,2>] == 1;
x[2][<10,1,2>] == 0;
x[2][<11,1,2>] == 0;
x[2][<12,1,2>] == 0;
x[2][<13,1,2>] == 0;
x[2][<14,1,2>] == 0;
x[2][<15,1,2>] == 0;
x[2][<16,1,2>] == 0;
x[2][<17,1,2>] == 0;
x[2][<18,1,2>] == 0;
x[2][<19,1,2>] == 0;
x[3][<1,1,2>] == 0;
x[3][<2,1,2>] == 0;
x[3][<3,1,2>] == 0;
x[3][<4,1,2>] == 0;
x[3][<5,1,2>] == 0;
x[3][<6,1,2>] == 0;
x[3][<7,1,2>] == 0;
x[3][<8,1,2>] == 0;
x[3][<9,1,2>] == 0;
x[3][<10,1,2>] == 1;
x[3][<11,1,2>] == 1;
x[3][<12,1,2>] == 0;
x[3][<13,1,2>] == 0;
x[3][<14,1,2>] == 0;
x[3][<15,1,2>] == 0;
x[3][<16,1,2>] == 0;
x[3][<17,1,2>] == 0;
x[3][<18,1,2>] == 0;
x[3][<19,1,2>] == 0;
x[4][<1,1,2>] == 0;
x[4][<2,1,2>] == 0;
x[4][<3,1,2>] == 0;
x[4][<4,1,2>] == 0;
x[4][<5,1,2>] == 0;
x[4][<6,1,2>] == 0;
x[4][<7,1,2>] == 0;
x[4][<8,1,2>] == 0;
x[4][<9,1,2>] == 0;
x[4][<10,1,2>] == 0;
x[4][<11,1,2>] == 0;
x[4][<12,1,2>] == 1;
x[4][<13,1,2>] == 1;
x[4][<14,1,2>] == 0;
x[4][<15,1,2>] == 0;
x[4][<16,1,2>] == 0;
x[4][<17,1,2>] == 0;
x[4][<18,1,2>] == 0;
x[4][<19,1,2>] == 0;
x[5][<1,1,2>] == 0;
x[5][<2,1,2>] == 0;
x[5][<3,1,2>] == 0;
x[5][<4,1,2>] == 0;
x[5][<5,1,2>] == 0;
x[5][<6,1,2>] == 0;
x[5][<7,1,2>] == 0;
x[5][<8,1,2>] == 0;
x[5][<9,1,2>] == 0;
x[5][<10,1,2>] == 0;
x[5][<11,1,2>] == 0;
x[5][<12,1,2>] == 0;
x[5][<13,1,2>] == 0;
x[5][<14,1,2>] == 1;
x[5][<15,1,2>] == 1;
x[5][<16,1,2>] == 0;
x[5][<17,1,2>] == 0;
x[5][<18,1,2>] == 0;
x[5][<19,1,2>] == 0;
x[6][<1,1,2>] == 0;
x[6][<2,1,2>] == 0;
x[6][<3,1,2>] == 0;
x[6][<4,1,2>] == 0;
x[6][<5,1,2>] == 0;
x[6][<6,1,2>] == 0;
x[6][<7,1,2>] == 0;
x[6][<8,1,2>] == 0;
x[6][<9,1,2>] == 0;
x[6][<10,1,2>] == 0;
x[6][<11,1,2>] == 0;
x[6][<12,1,2>] == 0;
x[6][<13,1,2>] == 0;
x[6][<14,1,2>] == 0;
x[6][<15,1,2>] == 0;
x[6][<16,1,2>] == 1;
x[6][<17,1,2>] == 1;
x[6][<18,1,2>] == 0;
x[6][<19,1,2>] == 0;
x[7][<1,1,2>] == 0;
x[7][<2,1,2>] == 0;
x[7][<3,1,2>] == 0;
x[7][<4,1,2>] == 0;
x[7][<5,1,2>] == 0;
x[7][<6,1,2>] == 0;
x[7][<7,1,2>] == 0;
x[7][<8,1,2>] == 0;
x[7][<9,1,2>] == 0;
x[7][<10,1,2>] == 0;
x[7][<11,1,2>] == 0;
x[7][<12,1,2>] == 0;
x[7][<13,1,2>] == 0;
x[7][<14,1,2>] == 0;
x[7][<15,1,2>] == 0;
x[7][<16,1,2>] == 0;
x[7][<17,1,2>] == 0;
x[7][<18,1,2>] == 1;
x[7][<19,1,2>] == 1;
*/
/* Categoria 2
x[1][<20,2,1>] == 1;
x[1][<21,2,1>] == 0;
x[1][<22,2,1>] == 0;
x[1][<23,2,1>] == 0;
x[1][<24,2,1>] == 0;
x[1][<25,2,1>] == 0;
x[2][<20,2,1>] == 0;
x[2][<21,2,1>] == 1;
x[2][<22,2,1>] == 0;
x[2][<23,2,1>] == 0;
x[2][<24,2,1>] == 0;
x[2][<25,2,1>] == 0;
x[3][<20,2,1>] == 0;
x[3][<21,2,1>] == 0;
x[3][<22,2,1>] == 1;
x[3][<23,2,1>] == 0;
x[3][<24,2,1>] == 0;
x[3][<25,2,1>] == 0;
x[4][<20,2,1>] == 0;
x[4][<21,2,1>] == 0;
x[4][<22,2,1>] == 0;
x[4][<23,2,1>] == 1;
x[4][<24,2,1>] == 0;
x[4][<25,2,1>] == 0;
x[5][<20,2,1>] == 0;
x[5][<21,2,1>] == 0;
x[5][<22,2,1>] == 0;
x[5][<23,2,1>] == 0;
x[5][<24,2,1>] == 1;
x[5][<25,2,1>] == 0;
x[6][<20,2,1>] == 0;
x[6][<21,2,1>] == 0;
x[6][<22,2,1>] == 0;
x[6][<23,2,1>] == 0;
x[6][<24,2,1>] == 0;
x[6][<25,2,1>] == 1;
x[7][<20,2,1>] == 0;
x[7][<21,2,1>] == 0;
x[7][<22,2,1>] == 0;
x[7][<23,2,1>] == 0;
x[7][<24,2,1>] == 0;
x[7][<25,2,1>] == 0;
x[1][<20,2,2>] == 1;
x[1][<21,2,2>] == 0;
x[1][<22,2,2>] == 0;
x[1][<23,2,2>] == 0;
x[1][<24,2,2>] == 0;
x[1][<25,2,2>] == 0;
x[2][<20,2,2>] == 0;
x[2][<21,2,2>] == 1;
x[2][<22,2,2>] == 0;
x[2][<23,2,2>] == 0;
x[2][<24,2,2>] == 0;
x[2][<25,2,2>] == 0;
x[3][<20,2,2>] == 0;
x[3][<21,2,2>] == 0;
x[3][<22,2,2>] == 1;
x[3][<23,2,2>] == 0;
x[3][<24,2,2>] == 0;
x[3][<25,2,2>] == 0;
x[4][<20,2,2>] == 0;
x[4][<21,2,2>] == 0;
x[4][<22,2,2>] == 0;
x[4][<23,2,2>] == 1;
x[4][<24,2,2>] == 0;
x[4][<25,2,2>] == 0;
x[5][<20,2,2>] == 0;
x[5][<21,2,2>] == 0;
x[5][<22,2,2>] == 0;
x[5][<23,2,2>] == 0;
x[5][<24,2,2>] == 1;
x[5][<25,2,2>] == 0;
x[6][<20,2,2>] == 0;
x[6][<21,2,2>] == 0;
x[6][<22,2,2>] == 0;
x[6][<23,2,2>] == 0;
x[6][<24,2,2>] == 0;
x[6][<25,2,2>] == 1;
x[7][<20,2,2>] == 0;
x[7][<21,2,2>] == 0;
x[7][<22,2,2>] == 0;
x[7][<23,2,2>] == 0;
x[7][<24,2,2>] == 0;
x[7][<25,2,2>] == 0;
*/
/* Categoria 3
x[1][<26,3,1>] == 1;
x[1][<27,3,1>] == 0;
x[1][<28,3,1>] == 0;
x[1][<29,3,1>] == 0;
x[2][<26,3,1>] == 0;
x[2][<27,3,1>] == 1;
x[2][<28,3,1>] == 0;
x[2][<29,3,1>] == 0;
x[3][<26,3,1>] == 0;
x[3][<27,3,1>] == 0;
x[3][<28,3,1>] == 1;
x[3][<29,3,1>] == 0;
x[4][<26,3,1>] == 0;
x[4][<27,3,1>] == 0;
x[4][<28,3,1>] == 0;
x[4][<29,3,1>] == 1;
x[5][<26,3,1>] == 0;
x[5][<27,3,1>] == 0;
x[5][<28,3,1>] == 0;
x[5][<29,3,1>] == 0;
x[6][<26,3,1>] == 0;
x[6][<27,3,1>] == 0;
x[6][<28,3,1>] == 0;
x[6][<29,3,1>] == 0;
x[7][<26,3,1>] == 0;
x[7][<27,3,1>] == 0;
x[7][<28,3,1>] == 0;
x[7][<29,3,1>] == 0;
x[1][<26,3,2>] == 1;
x[1][<27,3,2>] == 0;
x[1][<28,3,2>] == 0;
x[1][<29,3,2>] == 0;
x[2][<26,3,2>] == 0;
x[2][<27,3,2>] == 1;
x[2][<28,3,2>] == 0;
x[2][<29,3,2>] == 0;
x[3][<26,3,2>] == 0;
x[3][<27,3,2>] == 0;
x[3][<28,3,2>] == 1;
x[3][<29,3,2>] == 0;
x[4][<26,3,2>] == 0;
x[4][<27,3,2>] == 0;
x[4][<28,3,2>] == 0;
x[4][<29,3,2>] == 1;
x[5][<26,3,2>] == 0;
x[5][<27,3,2>] == 0;
x[5][<28,3,2>] == 0;
x[5][<29,3,2>] == 0;
x[6][<26,3,2>] == 0;
x[6][<27,3,2>] == 0;
x[6][<28,3,2>] == 0;
x[6][<29,3,2>] == 0;
x[7][<26,3,2>] == 0;
x[7][<27,3,2>] == 0;
x[7][<28,3,2>] == 0;
x[7][<29,3,2>] == 0;
*/


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
			ofile.writeln("categoria ",m.r);
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
				for(var irs in IRS){
					if(thisOplModel.alfa[k][irs]>0 && m.r==irs.r && m.s==irs.s){
						tiposItens++;				
					}			
				}
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
						ofile.write("Erro de ordenação:Limite de iterações atingido");					
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
	for(var k in K){
		for(var i2rs in I2RS){
			if(thisOplModel.beta[k][i2rs]>=0.8)		
				writeln("beta[",k,"][",i2rs,"]");	
		}
	}
	for(var k in K){
		for(var irs in IRS){
			if(thisOplModel.x[k][irs]>=0.8)		
				writeln("x[",k,"][",irs,"]");	
		}
	}
	for(var k in Kgama){
		for(var a in Ak){
			if(thisOplModel.gama[k][a]>=0.8)		
				writeln("gama[",k,"][",a,"]");	
		}
	}

	ofile.close();

}
//gama[k in 1..qtdeNiveis-1][Ak]
