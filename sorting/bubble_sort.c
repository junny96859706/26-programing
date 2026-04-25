#include <stdio.h>

// 버블 정렬 함수
void bubbleSort(int arr[], int n) {
    int i, j, temp;
    for (i = 0; i < n - 1; i++) {
        // 마지막 i개는 이미 정렬되어 있으므로 제외
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 인접한 두 원소의 순서가 바뀌어 있으면 교환
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// 배열 출력 함수
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main() {
    int data[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(data) / sizeof(data[0]);

    printf("정렬 전 배열: \n");
    printArray(data, n);

    bubbleSort(data, n);

    printf("정렬 후 배열 (오름차순): \n");
    printArray(data, n);

    return 0;
}
