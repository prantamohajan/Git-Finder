const input = document.getElementById('userInput');
const searchBtn = document.getElementById('searchBtn');
const profileCard = document.getElementById('profileCard');
const loader = document.getElementById('loader');
const bgOverlay = document.getElementById('bgOverlay');
const errorMsg = document.getElementById('errorMsg');

const url = "https://api.github.com/users/";


window.addEventListener('DOMContentLoaded', () => getUser("heyiampm"));

searchBtn.addEventListener('click', () => { if(input.value) getUser(input.value); });
input.addEventListener('keydown', (e) => { if(e.key === 'Enter' && input.value) getUser(input.value); });

async function getUser(username) {
    loader.style.display = "flex";
    profileCard.style.display = "none";
    errorMsg.style.display = "none";

    try {
        const res = await fetch(url + username);
        const data = await res.json();
        if(!res.ok) throw new Error();


        const socialRes = await fetch(`${url}${username}/social_accounts`);
        const socials = await socialRes.json();

        renderProfile(data, socials);
        loader.style.display = "none";
        profileCard.style.display = "block";
    } catch (err) {
        loader.style.display = "none";
        errorMsg.style.display = "block";
    }
}

function renderProfile(data, socials) {
    const avatarImg = data.avatar_url;
    document.getElementById('avatar').src = avatarImg;
    document.getElementById('name').innerText = data.name || data.login;
    document.getElementById('username').innerText = `@${data.login}`;
    document.getElementById('username').href = data.html_url;

    const companyEl = document.getElementById('company');
    if (data.company) {
        let name = data.company.startsWith('@') ? data.company.substring(1) : data.company;
        companyEl.innerText = name;
        companyEl.parentElement.classList.remove('unavailable');
    } else {
        companyEl.innerText = "Not Available";
        companyEl.parentElement.classList.add('unavailable');
    }


    const linkedinEl = document.getElementById('linkedin');
    const linkedinItem = document.getElementById('linkedinItem');
    const linkedinAcc = socials.find(acc => acc.provider === 'linkedin' || acc.url.includes('linkedin.com'));

    
    if (linkedinAcc) {
        linkedinEl.innerText = "LinkedIn Profile";
        linkedinEl.href = linkedinAcc.url;
        linkedinItem.classList.remove('unavailable');
    } else {
        linkedinEl.innerText = "Not Available";
        linkedinEl.href = "#";
        linkedinItem.classList.add('unavailable');
    }

    bgOverlay.style.backgroundImage = `url('${avatarImg}')`;
    profileCard.style.setProperty('--card-img', `url('${avatarImg}')`);


    const date = new Date(data.created_at);
    document.getElementById('date').innerText = `Joined ${date.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'})}`;
    document.getElementById('bio').innerText = data.bio || "This profile has no bio.";
    document.getElementById('repos').innerText = data.public_repos;
    document.getElementById('followers').innerText = data.followers;
    document.getElementById('following').innerText = data.following;
    document.getElementById('location').innerText = data.location || "Not Available";


    const blogEl = document.getElementById('blog');
    if(data.blog) {
        let webUrl = data.blog.startsWith('http') ? data.blog : `https://${data.blog}`;
        blogEl.innerText = "Visit Website";
        blogEl.href = webUrl;
        blogEl.parentElement.classList.remove('unavailable');
    } else {
        blogEl.innerText = "Not Available";
        blogEl.href = "#";
        blogEl.parentElement.classList.add('unavailable');
    }
}