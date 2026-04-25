#include <stdio.h>

int get_your_age();

int main() {

	int age;

	age = get_your_age();
	printf("Hello %d\n", age);
	printf("Nice to meet you %d\n",age);

	return 0;
}