
module.exports = {
    deploy: {
        dev: {
            host: ["58.76.178.208"],
            port: "22222",
            user: "parallels",
            ssh_options: 'StrictHostKeyChecking=no',
            path: '/home/parallels/code',
            ref: 'origin/master',
            repo: 'git@github.com:taehyoung/vue-drag-drop.git',
            'pre-setup': "whoami; pwd; echo 'This is a remote pre-setup executed command'",
            'pre-deploy-local': "echo 'This is a remote pre-setup executed command'",
            'post-setup': "echo 'setup complete'",
            'post-deploy': 'npm install; npm run build'
        }
    }
}