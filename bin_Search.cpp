/** MAX Heap
/*  uses an array implementation
/*  Array initialized at length of 5
/*  The program also includes a binary search algorithm of
/*  Time complexity=o(log n) */
#include <iostream>
#define MAX_SIZE 7
using namespace std;
int max_Heapify(int a[],int i,int n){
    int largest=i;
    int left=(2*i)+1;
    int right=(2*i)+2;
    //If left child is larger than Root
    if(left<n&&a[left]>a[largest]){
        largest=left;
    }
    //if right child is larger than largest So far
    if(right<n&&a[right]>a[largest]){
        largest=right;
    }
    if(largest!=i){
        swap(a[i],a[largest]);
        max_Heapify(a,largest,n);
    }

}
int createMax_Heap(int a[],int n){
    for(int i=n/2-1;i>=0;i--){
        max_Heapify(a,i,n);
    }

}
void sort_MaxHeap(int a[],int n){
    for(int i=n-1;i>=0;i--){
            swap(a[0],a[i]);
            createMax_Heap(a,i);
    }

}
int binary_search_fcn(int a[],int low,int high,int srch){
    if(high>=low){
            int mid=low+(high-low)/2;
            if(a[mid]==srch){
                return mid;
            }
            if(srch<a[mid]){
                //Means the value must be present in the lower deck of the tree
                return binary_search_fcn(a,low,mid-1,srch);
            }
            else{
                //Means the value must be present in the upper deck of the tree
                return binary_search_fcn(a,mid+1,high,srch);
            }
    }
    return -1;
}
int main(){
    int a[MAX_SIZE];
    int i,data;
    for(i=0;i<MAX_SIZE;i++){
        cout<<"Enter data "<<i+1<<" into the Array:";
        cin>>data;
        a[i]=data;
    }
    cout<<"Max Heap Structure!"<<endl;
    createMax_Heap(a,MAX_SIZE);
    for(int j=0;j<MAX_SIZE;j++){
        cout<<a[j]<<endl;
    }
    sort_MaxHeap(a,MAX_SIZE);
    cout<<"Sorted Heap!"<<endl;
    for(int j=0;j<=MAX_SIZE-1;j++){
        cout<<a[j]<<endl;
    }
    int searchval;
    cout<<"Input integer to search the binary search tree:";
    cin>>searchval;
    int result=binary_search_fcn(a,0,MAX_SIZE-1,searchval);
    if(result==-1){
        cout<<"\nThe search produced null results";
    }
    else
        cout<<"\nInteger "<<searchval<<" is present at index "<<result;
return 0;
}
