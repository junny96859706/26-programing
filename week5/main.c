#include <stdio.h>

double calcTriangleArea(int a,int b);
double calcRectangleArea(int a,int b);

int main(){
	int a,b;
	double triArea;
	double recArea;

	printf("정수2개를 입력하세요:");
	scanf("%d %d",&a,&b);

	triArea = calcTriangleArea(a,b);
	recArea = calcRectangleArea(a,b);
	printf("삼각형 면적=%.01f\n",triArea);
	printf("사각형 면적=%.01f\n",recArea);

	return 0;
}
