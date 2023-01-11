import { GithubUser } from "./GithubSeach.js"

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.tbody =  this.root.querySelector('table tbody')
        this.load()
        
        GithubUser.search('diego3g').then(user => console.log(user))
    }
    async add(username){
        try{
            const userExists = this.entries.find(entry => entry.login === username)
            console.log(userExists)

            if(userExists){
                throw new Error('Usuario já cadastrado')
            }



            const user = await GithubUser.search(username)
            if (user.login === undefined) {
                throw new Error('Usúario não encontrado!')
            }
            this.entries = [user,...this.entries]
            this.update()
            this.save()
        }
        catch(error){
            alert(error.message)
        }
    }

    save(){
        localStorage.setItem('@github-favorites:',JSON.stringify(this.entries))
    }
    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        
    }
    delete(user){
        const filteredEntries = this.entries
        .filter(entry=> entry.login !== user.login)
        console.log(filteredEntries)

        this.entries = filteredEntries
        this.update()
        this.save();
    }
}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        this.update()
        this.onadd()
    }
    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick =()=>{
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }
    update(){
        this.removeAllTr()
    
        this.entries.forEach(user =>{
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem do ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent=user.name
            row.querySelector('.user span').textContent=user.login

            row.querySelector('.repositories').textContent=user.public_repos
            row.querySelector('.followers').textContent=user.followers
            row.querySelector('.remove').onclick = () =>{
                const isOk = confirm('Tem certeza que deseja deletar essa linha ?')
                if (isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
        
    }

    createRow(){

        const tr = document.createElement('tr')
        const content = `
        
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem">
                <a href="https://github.com/maykbrito">
                    <p>Vinicius Sette</p>
                    <span>vinisette</span>
                </a>
            </td>
            <td class="repositories">
                70
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        
        `
        tr.innerHTML = content
        return tr
    }
    
    removeAllTr(){
        
        this.tbody.querySelectorAll('tr').forEach((tr)=>{
            tr.remove()
        })
    }
    
}
