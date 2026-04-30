def level1():
    print(f'Вітаю, {input("Введіть своє ім'я:\n")}!')

def level2(a):
    for n in a:
        print(n, n * n)

def level3(a):
    return [n for n in a if not n % 2]

def level4():
    r = requests.get('https://httpbin.org/ip')
    print(f'Ваша IP-адреса: {r.json()["origin"]}')

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    import requests

    a = [i for i in range(1, 21)]
    level1()
    level2(a)
    print(level3(a))
    level4()