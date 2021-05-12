export let listCommands = [
        {
            command : "tx!daily",
            arg : null,
            description : "Nhận quà hằng ngày"
        },{
            command : "tx!bet",
            syntax : `tx!bet [số tiền](>= 500) [lựa chọn](tai hoặc xiu)`,
            arg : ["tai","xiu"],
            description : "Đặt cược tài xỉu"
        },{

            command : "tx!user",
            arg : null,
            description : "Thông tin developer"
        },{
            command : "tx!profile",
            syntax : "tx!profile [@taguser]",
            arg : ["@taguser"],
            description : "Thông tin người dùng"
        }
    ]


