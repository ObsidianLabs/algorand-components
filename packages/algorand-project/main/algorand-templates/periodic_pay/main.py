from pyteal import *

#template variables
tmpl_fee = Int(1000)
tmpl_period = Int(1000)
tmpl_dur = Int(1000)
tmpl_x = Bytes("base64", "") # 32-byte string
tmpl_amt = Int(2000)
tmpl_rcv = Addr("") # receiver address
tmpl_timeout = Int(30000)

periodic_pay_core = And(Txn.type_enum() == Int(1),
    Txn.fee() < tmpl_fee)

periodic_pay_transfer = And(Txn.close_remainder_to() ==  Global.zero_address(),
    Txn.receiver() == tmpl_rcv,
    Txn.amount() == tmpl_amt,
    Txn.first_valid() % tmpl_period == Int(0),
    Txn.last_valid() == tmpl_dur + Txn.first_valid(),
    Txn.lease() == tmpl_x)

periodic_pay_close = And(Txn.close_remainder_to() == tmpl_rcv,
    Txn.receiver() == Global.zero_address(),
    Txn.first_valid() > tmpl_timeout,
    Txn.amount() == Int(0))

periodic_pay_escrow = And(periodic_pay_core, Or(periodic_pay_transfer, periodic_pay_close))

print(compileTeal(periodic_pay_escrow, Mode.Signature))