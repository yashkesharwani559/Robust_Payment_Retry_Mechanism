package com.example.paymentretry.exception;

public class UnauthorisedAccess extends RuntimeException{
    public UnauthorisedAccess(String msg) { super(msg); }
}
